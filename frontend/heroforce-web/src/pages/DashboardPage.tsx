import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import logo from '../assets/homem-aranha-branca-pequena.png'
import api from '../services/api'

// ── Types ──────────────────────────────────────────────────────────
interface TokenPayload {
  sub: string
  email: string
  role: string
}

interface User {
  id: string
  name: string
  email: string
  character: string
}

interface Project {
  id: string
  name: string
  description: string
  status: 'pendente' | 'em andamento' | 'concluído'
  goals: string[]
  user: User
}

const STATUS_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  'pendente':     { bg: 'rgba(186,117,23,0.12)', color: '#EF9F27', border: 'rgba(186,117,23,0.35)' },
  'em andamento': { bg: 'rgba(55,138,221,0.12)', color: '#378ADD', border: 'rgba(55,138,221,0.35)' },
  'concluído':    { bg: 'rgba(99,153,34,0.12)',  color: '#639922', border: 'rgba(99,153,34,0.35)'  },
}

const ALL_GOALS = ['agilidade', 'encantamento', 'eficiência', 'excelência', 'transparência', 'ambição']
const ALL_STATUS = ['pendente', 'em andamento', 'concluído']

// ── Icons ──────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
)
const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

// ── Component ──────────────────────────────────────────────────────
export default function DashboardPage() {
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const me = token ? jwtDecode<TokenPayload>(token) : null
  const isAdmin = me?.role === 'admin'

  const [projects, setProjects] = useState<Project[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  // filters
  const [filterStatus, setFilterStatus] = useState('')
  const [filterHero, setFilterHero] = useState('')

  // modal
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState<Project | null>(null)
  const [form, setForm] = useState({
    name: '', description: '', status: 'pendente', goals: [] as string[], userId: '',
  })
  const [saving, setSaving] = useState(false)

  // ── Data fetching ──
  const fetchProjects = async () => {
    try {
      const endpoint = isAdmin ? '/projects' : `/projects/user/${me?.sub}`
      const { data } = await api.get(endpoint)
      setProjects(data)
    } catch {
      navigate('/') 
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const { data } = await api.get('/user')
      setUsers(data)
    } catch { /* silently fail */ }
  }

  useEffect(() => {
    if (!token) { navigate('/'); return }
    fetchProjects()
    if (isAdmin) fetchUsers()
  }, [])

  // ── Filters ──
  const filtered = projects.filter(p => {
    const matchStatus = filterStatus ? p.status === filterStatus : true
    const matchHero   = filterHero   ? p.user?.name?.toLowerCase().includes(filterHero.toLowerCase()) : true
    return matchStatus && matchHero
  })

  // ── Modal ──
  const openCreate = () => {
    setEditing(null)
    setForm({ name: '', description: '', status: 'pendente', goals: [], userId: me?.sub || '' })
    setShowModal(true)
  }

  const openEdit = (p: Project) => {
    setEditing(p)
    setForm({ name: p.name, description: p.description, status: p.status, goals: p.goals, userId: p.user?.id || '' })
    setShowModal(true)
  }

  const toggleGoal = (goal: string) => {
    setForm(f => ({
      ...f,
      goals: f.goals.includes(goal) ? f.goals.filter(g => g !== goal) : [...f.goals, goal],
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editing) {
        await api.patch(`/projects/${editing.id}`, form)
      } else {
        await api.post('/projects', form)
      }
      setShowModal(false)
      fetchProjects()
    } catch {
      alert('Erro ao salvar projeto.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return
    await api.delete(`/projects/${id}`)
    fetchProjects()
  }

  const logout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  // ── Render ──
  return (
    <div style={s.page}>

      {/* Navbar */}
      <nav style={s.nav}>
        <div style={s.navLeft}>
          <img src={logo} alt="Logo do Homem-Aranha" />
          <span style={s.navBrand}>HeroForce</span>
        </div>
        <div style={s.navRight}>
          <span style={s.navEmail}>{me?.email}</span>
          {isAdmin && <span style={s.adminBadge}>admin</span>}
          <button onClick={logout} style={s.logoutBtn}>
            <LogoutIcon /> Sair
          </button>
        </div>
      </nav>

      {/* Main */}
      <main style={s.main}>

        {/* Header row */}
        <div style={s.topRow}>
          <div>
            <h1 style={s.pageTitle}>Projetos heroicos</h1>
            <p style={s.pageSubtitle}>{filtered.length} projeto{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}</p>
          </div>
          {isAdmin && (
            <button onClick={openCreate} style={s.createBtn}>
              <PlusIcon /> Novo projeto
            </button>
          )}
        </div>

        {/* Filters */}
        <div style={s.filters}>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={s.select}>
            <option value="">Todos os status</option>
            {ALL_STATUS.map(st => <option key={st} value={st}>{st}</option>)}
          </select>
          {isAdmin && (
            <input
              type="text"
              placeholder="Filtrar por herói..."
              value={filterHero}
              onChange={e => setFilterHero(e.target.value)}
              style={s.filterInput}
            />
          )}
            
          {(filterStatus || filterHero) && (
            <button onClick={() => { setFilterStatus(''); setFilterHero('') }} style={s.clearBtn}>
              Limpar filtros
            </button>
          )}
        </div>

        {/* Projects grid */}
        {loading ? (
          <p style={s.emptyText}>Carregando projetos...</p>
        ) : filtered.length === 0 ? (
          <p style={s.emptyText}>Nenhum projeto encontrado.</p>
        ) : (
          <div style={s.grid}>
            {filtered.map(p => {
              const sc = STATUS_COLORS[p.status] || STATUS_COLORS['pendente']
              return (
                <div key={p.id} style={s.card}>
                  <div style={s.cardTop}>
                    <span style={{ ...s.statusBadge, background: sc.bg, color: sc.color, border: `0.5px solid ${sc.border}` }}>
                      {p.status}
                    </span>
                    {isAdmin && (
                      <div style={s.cardActions}>
                        <button onClick={() => openEdit(p)} style={s.iconBtn} title="Editar"><EditIcon /></button>
                        <button onClick={() => handleDelete(p.id)} style={{ ...s.iconBtn, color: '#ff4d6d' }} title="Excluir"><TrashIcon /></button>
                      </div>
                    )}
                  </div>

                  <h3 style={s.cardTitle}>{p.name}</h3>
                  <p style={s.cardDesc}>{p.description}</p>

                  {/* Goals */}
                  {p.goals?.length > 0 && (
                    <div style={s.goalRow}>
                      {p.goals.map(g => (
                        <span key={g} style={s.goalTag}>{g}</span>
                      ))}
                    </div>
                  )}

                  {/* Responsible */}
                  <div style={s.cardFooter}>
                    <div style={s.avatar}>
                      {p.user?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <p style={s.heroName}>{p.user?.name || 'Sem responsável'}</p>
                      <p style={s.heroCharacter}>{p.user?.character || ''}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div style={s.overlay}>
          <div style={s.modal}>
            <div style={s.modalHeader}>
              <h2 style={s.modalTitle}>{editing ? 'Editar projeto' : 'Novo projeto'}</h2>
              <button onClick={() => setShowModal(false)} style={s.closeBtn}><CloseIcon /></button>
            </div>

            <div style={s.modalBody}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Nome</label>
                <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={s.input} placeholder="Nome do projeto"/>
              </div>

              <div style={s.fieldGroup}>
                <label style={s.label}>Descrição</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} style={{ ...s.input, height: '80px', resize: 'vertical' }} placeholder="Descrição do projeto"/>
              </div>

              <div style={s.fieldGroup}>
                <label style={s.label}>Status</label>
                <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))} style={s.input}>
                  {ALL_STATUS.map(st => <option key={st} value={st}>{st}</option>)}
                </select>
              </div>

              <div style={s.fieldGroup}>
                <label style={s.label}>Metas</label>
                <div style={s.goalGrid}>
                  {ALL_GOALS.map(g => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => toggleGoal(g)}
                      style={{
                        ...s.goalToggle,
                        ...(form.goals.includes(g) ? s.goalToggleActive : {}),
                      }}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {isAdmin && users.length > 0 && (
                <div style={s.fieldGroup}>
                  <label style={s.label}>Responsável</label>
                  <select value={form.userId} onChange={e => setForm(f => ({ ...f, userId: e.target.value }))} style={s.input}>
                    <option value="">Selecione um herói</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name} — {u.character}</option>)}
                  </select>
                </div>
              )}
            </div>

            <div style={s.modalFooter}>
              <button onClick={() => setShowModal(false)} style={s.cancelBtn}>Cancelar</button>
              <button onClick={handleSave} disabled={saving} style={s.saveBtn}>
                {saving ? 'Salvando...' : editing ? 'Salvar alterações' : 'Criar projeto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ── Styles ──────────────────────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', backgroundColor: '#0d0d1a', color: '#f0f0ff', fontFamily: 'sans-serif' },

  // Nav
  nav: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem', height: '60px', borderBottom: '0.5px solid rgba(192,0,42,0.2)', backgroundColor: '#10101f', position: 'sticky', top: 0, zIndex: 10 },
  navLeft: { display: 'flex', alignItems: 'center', gap: '10px' },
  navBrand: { fontSize: '18px', fontWeight: 700, color: '#f0f0ff', letterSpacing: '-0.5px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '12px' },
  navEmail: { fontSize: '13px', color: '#8888aa' },
  adminBadge: { backgroundColor: 'rgba(192,0,42,0.15)', color: '#ff4d6d', border: '0.5px solid rgba(192,0,42,0.35)', borderRadius: '99px', padding: '2px 10px', fontSize: '11px', fontWeight: 500 },
  logoutBtn: { display: 'flex', alignItems: 'center', gap: '6px', background: 'none', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#8888aa', fontSize: '13px', padding: '6px 12px', cursor: 'pointer' },

  // Main
  main: { padding: '2rem', maxWidth: '1200px', margin: '0 auto' },
  topRow: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' },
  pageTitle: { fontSize: '24px', fontWeight: 700, margin: '0 0 4px', color: '#f0f0ff' },
  pageSubtitle: { fontSize: '13px', color: '#8888aa', margin: 0 },
  createBtn: { display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#c0002a', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 16px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },

  // Filters
  filters: { display: 'flex', gap: '12px', marginBottom: '1.5rem', flexWrap: 'wrap' },
  select: { backgroundColor: '#1a1a35', border: '0.5px solid rgba(192,0,42,0.25)', borderRadius: '8px', color: '#f0f0ff', padding: '8px 12px', fontSize: '13px', outline: 'none', minWidth: '180px' },
  filterInput: { backgroundColor: '#1a1a35', border: '0.5px solid rgba(192,0,42,0.25)', borderRadius: '8px', color: '#f0f0ff', padding: '8px 12px', fontSize: '13px', outline: 'none', minWidth: '200px' },
  clearBtn: { background: 'none', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#8888aa', fontSize: '13px', padding: '8px 12px', cursor: 'pointer' },

  // Grid
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' },
  emptyText: { color: '#8888aa', textAlign: 'center', marginTop: '3rem' },

  // Card
  card: { backgroundColor: '#12122a', border: '0.5px solid rgba(192,0,42,0.2)', borderRadius: '12px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  statusBadge: { borderRadius: '99px', padding: '3px 12px', fontSize: '12px', fontWeight: 500 },
  cardActions: { display: 'flex', gap: '6px' },
  iconBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#8888aa', display: 'flex', alignItems: 'center', padding: '4px' },
  cardTitle: { fontSize: '16px', fontWeight: 600, margin: 0, color: '#f0f0ff' },
  cardDesc: { fontSize: '13px', color: '#8888aa', margin: 0, lineHeight: 1.5 },
  goalRow: { display: 'flex', flexWrap: 'wrap', gap: '6px' },
  goalTag: { backgroundColor: 'rgba(192,0,42,0.1)', color: '#ff4d6d', border: '0.5px solid rgba(192,0,42,0.25)', borderRadius: '99px', padding: '2px 10px', fontSize: '11px' },
  cardFooter: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '0.5px solid rgba(255,255,255,0.06)' },
  avatar: { width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(192,0,42,0.2)', color: '#ff4d6d', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600, flexShrink: 0 },
  heroName: { fontSize: '13px', fontWeight: 500, margin: 0, color: '#f0f0ff' },
  heroCharacter: { fontSize: '11px', color: '#8888aa', margin: 0 },

  // Modal
  overlay: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' },
  modal: { backgroundColor: '#12122a', border: '0.5px solid rgba(192,0,42,0.3)', borderRadius: '16px', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '0.5px solid rgba(255,255,255,0.07)' },
  modalTitle: { fontSize: '18px', fontWeight: 600, margin: 0, color: '#f0f0ff' },
  closeBtn: { background: 'none', border: 'none', color: '#8888aa', cursor: 'pointer', display: 'flex', alignItems: 'center' },
  modalBody: { padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' },
  modalFooter: { display: 'flex', justifyContent: 'flex-end', gap: '10px', padding: '1rem 1.5rem', borderTop: '0.5px solid rgba(255,255,255,0.07)' },
  fieldGroup: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '13px', color: '#8888aa' },
  input: { backgroundColor: '#1a1a35', border: '0.5px solid rgba(192,0,42,0.25)', borderRadius: '8px', color: '#f0f0ff', padding: '10px 12px', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' },
  goalGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  goalToggle: { backgroundColor: 'transparent', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: '99px', color: '#8888aa', padding: '4px 14px', fontSize: '12px', cursor: 'pointer' },
  goalToggleActive: { backgroundColor: 'rgba(192,0,42,0.15)', border: '0.5px solid rgba(192,0,42,0.5)', color: '#ff4d6d' },
  cancelBtn: { background: 'none', border: '0.5px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#8888aa', padding: '9px 18px', fontSize: '14px', cursor: 'pointer' },
  saveBtn: { backgroundColor: '#c0002a', color: '#fff', border: 'none', borderRadius: '8px', padding: '9px 18px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' },
}