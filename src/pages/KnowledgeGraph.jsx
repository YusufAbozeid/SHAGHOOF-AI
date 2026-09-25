import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import api from '../services/api'
import Mascot from '../components/Mascot'

export default function KnowledgeGraph() {
  const { user } = useApp()
  const subjects = user?.subjects || []
  const [courseId, setCourseId] = useState(subjects[0]?.name || 'CS101')
  const [loading, setLoading] = useState(false)
  const [graph, setGraph] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)

  const fetchGraph = async (idToFetch) => {
    const target = idToFetch || courseId
    if (!target) return
    setLoading(true)
    setSelectedNode(null)
    try {
      const res = await api.getKnowledgeGraph(target)
      setGraph(res)
    } catch {
      setGraph(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGraph(courseId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const nodes = graph?.nodes || graph?.concepts || []
  const edges = graph?.edges || []
  const clusters = graph?.clusters || []

  const clusterMap = Object.fromEntries(clusters.map(c => [c.id, c]))

  const getConnectedEdges = (nodeId) => {
    return edges.filter(e => e.source === nodeId || e.target === nodeId)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Mascot size={48} animate mood="happy" className="mascot-float" />
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--brand)]" style={{ fontFamily: 'var(--font-heading)' }}>
            شبكة المفاهيم 🕸️ Knowledge Graph
          </h1>
          <p className="text-sm text-[var(--muted)]">
            خريطة تفاعلية توضح ترابط المفاهيم العلمية والتسلسل المعرفي للمنهج
          </p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="flex flex-wrap gap-2 items-center">
          {subjects.map((s) => (
            <button
              key={s.id}
              onClick={() => { setCourseId(s.name); fetchGraph(s.name) }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${
                courseId === s.name
                  ? 'bg-[var(--brand)] text-white border-[var(--brand)]'
                  : 'bg-[var(--surface)] text-[var(--ink)] border-[var(--line)] hover:border-[var(--brand)]'
              }`}
            >
              {s.name}
            </button>
          ))}
          <div className="flex-1 min-w-[200px] flex gap-2">
            <input
              type="text"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              placeholder="كود المادة أو اسمها (e.g. CS101, Math)..."
              className="brand-input text-xs py-1.5"
            />
            <button
              onClick={() => fetchGraph()}
              disabled={!courseId || loading}
              className="brand-btn-primary text-xs px-4 py-1.5 whitespace-nowrap"
            >
              {loading ? 'تحميل...' : 'عرض الخريطة'}
            </button>
          </div>
        </div>
      </div>

      {graph && (
        <div className="space-y-6">
          {/* Clusters summary header */}
          {clusters.length > 0 && (
            <div className="flex flex-wrap gap-2 p-3 bg-[var(--surface)] rounded-xl border border-[var(--line)]">
              <span className="text-xs font-bold text-[var(--muted)] self-center ml-2">المسارات:</span>
              {clusters.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ backgroundColor: `${c.color}20`, color: c.color, border: `1px solid ${c.color}40` }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: c.color }} />
                  {c.name || c.id}
                </div>
              ))}
            </div>
          )}

          {/* Nodes grid representation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-[var(--line)] rounded-xl p-4 bg-[var(--surface)] shadow-sm">
              <h3 className="text-sm font-extrabold text-[var(--ink)] mb-3 flex items-center justify-between">
                <span>المفاهيم الأساسية ({nodes.length})</span>
                <span className="text-[10px] text-[var(--muted)]">اضغط على أي مفهوم لمعرفة علاقاته</span>
              </h3>

              <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                {nodes.map((node) => {
                  const cluster = clusterMap[node.category] || {}
                  const isSelected = selectedNode?.id === node.id
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelectedNode(node)}
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-[var(--brand)] bg-[var(--brand-light)] shadow-sm'
                          : 'border-[var(--line)] hover:border-[var(--brand)] bg-[var(--surface)]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                            style={{ backgroundColor: cluster.color || '#3b82f6' }}
                          />
                          <span className="text-sm font-bold text-[var(--ink)]">
                            {node.labelAr || node.label || node.name}
                          </span>
                          {node.label && node.labelAr && (
                            <span className="text-xs text-[var(--muted)] font-mono">({node.label})</span>
                          )}
                        </div>
                        {node.level && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[var(--muted)] font-semibold">
                            مستوى {node.level}
                          </span>
                        )}
                      </div>
                      {node.description && (
                        <p className="text-xs text-[var(--muted)] mt-1">{node.description}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Concept relationships inspection pane */}
            <div className="border border-[var(--line)] rounded-xl p-4 bg-[var(--surface)] shadow-sm flex flex-col">
              <h3 className="text-sm font-extrabold text-[var(--ink)] mb-3">
                تفاصيل المفهوم والترابط المعرفي
              </h3>

              {selectedNode ? (
                <div className="space-y-4 flex-1">
                  <div className="p-4 rounded-xl bg-[var(--brand-light)]/40 border border-[var(--brand)]/30">
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-extrabold text-[var(--brand)]">
                        {selectedNode.labelAr || selectedNode.label || selectedNode.name}
                      </h4>
                      <span className="text-xs font-bold text-[var(--muted)] font-mono">
                        {selectedNode.label}
                      </span>
                    </div>
                    {clusterMap[selectedNode.category] && (
                      <div className="mt-2 inline-block px-2.5 py-0.5 rounded text-xs font-semibold" style={{ backgroundColor: `${clusterMap[selectedNode.category].color}25`, color: clusterMap[selectedNode.category].color }}>
                        المسار: {clusterMap[selectedNode.category].name}
                      </div>
                    )}
                  </div>

                  <div>
                    <h5 className="text-xs font-extrabold text-[var(--muted)] mb-2 uppercase tracking-wider">
                      الروابط والعلاقات المباشرة:
                    </h5>
                    {getConnectedEdges(selectedNode.id).length === 0 ? (
                      <p className="text-xs text-[var(--muted)] italic">لا توجد روابط مسجلة لهذا المفهوم.</p>
                    ) : (
                      <div className="space-y-2">
                        {getConnectedEdges(selectedNode.id).map((edge, idx) => {
                          const isSource = edge.source === selectedNode.id
                          const otherId = isSource ? edge.target : edge.source
                          const otherNode = nodes.find(n => n.id === otherId)
                          return (
                            <div key={idx} className="p-2.5 rounded-lg border border-[var(--line)] bg-[var(--surface)] text-xs flex items-center justify-between">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-[var(--brand)]">
                                  {isSource ? 'يؤدي إلى ➡️' : 'يعتمد على ⬅️'}
                                </span>
                                <span className="font-bold text-[var(--ink)]">
                                  {otherNode?.labelAr || otherNode?.label || otherId}
                                </span>
                              </div>
                              {edge.label && (
                                <span className="px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-[10px] font-semibold">
                                  {edge.label}
                                </span>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-[var(--muted)]">
                  <span className="text-3xl mb-2">💡</span>
                  <p className="text-sm font-semibold">اختر مفهوماً من القائمة لمعاينة علاقاته وترتيبه</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
