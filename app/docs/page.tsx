// "use client"
// // app/(dashboard)/docs/page.tsx
// import * as React from "react"
// import {
//     IconBolt,
//     IconKey,
//     IconApi,
//     IconCode,
//     IconCheck,
//     IconCopy,
//     IconChevronRight,
//     IconMessage,
//     IconSend,
//     IconTrash,
//     IconList,
// } from "@tabler/icons-react"
// import { Badge } from "@/components/ui/badge"
// import { cn } from "@/lib/utils"

// // ─── Types ────────────────────────────────────────────────────────────────────

// type Lang = "curl" | "js" | "python"

// interface NavSection {
//     id: string
//     label: string
//     icon: React.ElementType
//     items: { id: string; label: string }[]
// }

// // ─── Nav config ───────────────────────────────────────────────────────────────

// const NAV: NavSection[] = [
//     {
//         id: "quickstart",
//         label: "Quickstart",
//         icon: IconBolt,
//         items: [
//             { id: "quickstart-intro", label: "Introduction" },
//             { id: "quickstart-install", label: "Installation" },
//             { id: "quickstart-first", label: "First Message" },
//         ],
//     },
//     {
//         id: "authentication",
//         label: "Authentication",
//         icon: IconKey,
//         items: [
//             { id: "auth-overview", label: "Overview" },
//             { id: "auth-create", label: "Creating a Key" },
//             { id: "auth-usage", label: "Using Your Key" },
//         ],
//     },
//     {
//         id: "api",
//         label: "API Reference",
//         icon: IconApi,
//         items: [
//             { id: "api-messages-list", label: "List Messages" },
//             { id: "api-messages-send", label: "Send Message" },
//             { id: "api-messages-delete", label: "Delete Message" },
//             { id: "api-keys-list", label: "List API Keys" },
//             { id: "api-keys-create", label: "Create API Key" },
//             { id: "api-keys-delete", label: "Delete API Key" },
//         ],
//     },
//     {
//         id: "examples",
//         label: "Code Examples",
//         icon: IconCode,
//         items: [
//             { id: "examples-send", label: "Send SMS" },
//             { id: "examples-bulk", label: "Bulk Sending" },
//             { id: "examples-webhook", label: "Status Polling" },
//         ],
//     },
// ]

// // ─── Code block ───────────────────────────────────────────────────────────────

// function CodeBlock({ code, lang }: { code: string; lang?: string }) {
//     const [copied, setCopied] = React.useState(false)
//     const copy = () => {
//         navigator.clipboard.writeText(code)
//         setCopied(true)
//         setTimeout(() => setCopied(false), 2000)
//     }
//     return (
//         <div className="relative group rounded-lg overflow-hidden border border-border bg-muted/60 my-4">
//             {lang && (
//                 <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/80 text-xs text-muted-foreground font-mono">
//                     <span>{lang}</span>
//                     <button
//                         onClick={copy}
//                         className="flex items-center gap-1.5 hover:text-foreground transition-colors"
//                     >
//                         {copied ? (
//                             <><IconCheck className="h-3.5 w-3.5 text-green-500" />Copied</>
//                         ) : (
//                             <><IconCopy className="h-3.5 w-3.5" />Copy</>
//                         )}
//                     </button>
//                 </div>
//             )}
//             <pre className="p-4 text-sm overflow-x-auto leading-relaxed font-mono text-foreground/90">
//                 <code>{code}</code>
//             </pre>
//         </div>
//     )
// }

// // ─── Multi-lang tabs ──────────────────────────────────────────────────────────

// function MultiLangBlock({ examples }: { examples: Record<Lang, string> }) {
//     const [lang, setLang] = React.useState<Lang>("curl")
//     const langs: { id: Lang; label: string }[] = [
//         { id: "curl", label: "cURL" },
//         { id: "js", label: "JavaScript" },
//         { id: "python", label: "Python" },
//     ]
//     return (
//         <div className="rounded-lg overflow-hidden border border-border my-4">
//             <div className="flex border-b border-border bg-muted/80">
//                 {langs.map((l) => (
//                     <button
//                         key={l.id}
//                         onClick={() => setLang(l.id)}
//                         className={cn(
//                             "px-4 py-2 text-xs font-mono transition-colors",
//                             lang === l.id
//                                 ? "bg-background text-foreground border-b-2 border-primary"
//                                 : "text-muted-foreground hover:text-foreground"
//                         )}
//                     >
//                         {l.label}
//                     </button>
//                 ))}
//             </div>
//             <div className="relative bg-muted/60">
//                 <button
//                     onClick={() => {
//                         navigator.clipboard.writeText(examples[lang])
//                     }}
//                     className="absolute right-3 top-3 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-mono transition-colors"
//                 >
//                     <IconCopy className="h-3.5 w-3.5" />
//                     Copy
//                 </button>
//                 <pre className="p-4 text-sm overflow-x-auto leading-relaxed font-mono text-foreground/90">
//                     <code>{examples[lang]}</code>
//                 </pre>
//             </div>
//         </div>
//     )
// }

// // ─── Method badge ─────────────────────────────────────────────────────────────

// const methodColors: Record<string, string> = {
//     GET: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/20",
//     POST: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/20",
//     DELETE: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20",
//     PATCH: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
// }

// function MethodBadge({ method }: { method: string }) {
//     return (
//         <span className={cn("font-mono text-xs font-bold px-2 py-0.5 rounded border", methodColors[method])}>
//             {method}
//         </span>
//     )
// }

// // ─── Endpoint block ───────────────────────────────────────────────────────────

// function Endpoint({
//     method,
//     path,
//     description,
//     auth = true,
//     params,
//     body,
//     response,
//     examples,
// }: {
//     method: string
//     path: string
//     description: string
//     auth?: boolean
//     params?: { name: string; type: string; required: boolean; desc: string }[]
//     body?: { name: string; type: string; required: boolean; desc: string }[]
//     response: string
//     examples: Record<Lang, string>
// }) {
//     return (
//         <div className="border border-border rounded-lg overflow-hidden mb-6">
//             {/* Header */}
//             <div className="flex items-center gap-3 px-4 py-3 bg-muted/50 border-b border-border">
//                 <MethodBadge method={method} />
//                 <code className="text-sm font-mono text-foreground/80">{path}</code>
//                 {auth && (
//                     <Badge variant="outline" className="ml-auto text-xs flex items-center gap-1">
//                         <IconKey className="h-3 w-3" /> Auth required
//                     </Badge>
//                 )}
//             </div>

//             <div className="p-4 flex flex-col gap-4">
//                 <p className="text-sm text-muted-foreground">{description}</p>

//                 {/* Parameters */}
//                 {params && params.length > 0 && (
//                     <div>
//                         <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
//                             Query Parameters
//                         </p>
//                         <div className="flex flex-col gap-1">
//                             {params.map((p) => (
//                                 <div key={p.name} className="flex items-start gap-2 text-sm py-1 border-b border-border/50 last:border-0">
//                                     <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono shrink-0">{p.name}</code>
//                                     <span className="text-xs text-muted-foreground shrink-0">{p.type}</span>
//                                     {!p.required && <Badge variant="outline" className="text-xs py-0 shrink-0">optional</Badge>}
//                                     <span className="text-xs text-muted-foreground">{p.desc}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}

//                 {/* Body */}
//                 {body && body.length > 0 && (
//                     <div>
//                         <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
//                             Request Body
//                         </p>
//                         <div className="flex flex-col gap-1">
//                             {body.map((b) => (
//                                 <div key={b.name} className="flex items-start gap-2 text-sm py-1 border-b border-border/50 last:border-0">
//                                     <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono shrink-0">{b.name}</code>
//                                     <span className="text-xs text-muted-foreground shrink-0">{b.type}</span>
//                                     {b.required
//                                         ? <Badge className="text-xs py-0 shrink-0">required</Badge>
//                                         : <Badge variant="outline" className="text-xs py-0 shrink-0">optional</Badge>
//                                     }
//                                     <span className="text-xs text-muted-foreground">{b.desc}</span>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 )}

//                 {/* Examples */}
//                 <div>
//                     <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
//                         Example Request
//                     </p>
//                     <MultiLangBlock examples={examples} />
//                 </div>

//                 {/* Response */}
//                 <div>
//                     <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
//                         Response
//                     </p>
//                     <CodeBlock code={response} lang="json" />
//                 </div>
//             </div>
//         </div>
//     )
// }

// // ─── Section wrapper ──────────────────────────────────────────────────────────

// function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
//     return (
//         <section id={id} className="scroll-mt-6 mb-12">
//             <h2 className="text-xl font-semibold mb-4 pb-2 border-b border-border">{title}</h2>
//             {children}
//         </section>
//     )
// }

// function SubSection({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
//     return (
//         <div id={id} className="scroll-mt-6 mb-8">
//             <h3 className="text-base font-semibold mb-3">{title}</h3>
//             {children}
//         </div>
//     )
// }

// // ─── Main page ────────────────────────────────────────────────────────────────

// export default function DocsPage() {
//     const [activeId, setActiveId] = React.useState("quickstart-intro")
//     const [mobileNavOpen, setMobileNavOpen] = React.useState(false)

//     const scrollTo = (id: string) => {
//         setActiveId(id)
//         setMobileNavOpen(false)
//         document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" })
//     }

//     // Highlight active section on scroll
//     React.useEffect(() => {
//         const allIds = NAV.flatMap((s) => s.items.map((i) => i.id))
//         const observer = new IntersectionObserver(
//             (entries) => {
//                 entries.forEach((e) => {
//                     if (e.isIntersecting) setActiveId(e.target.id)
//                 })
//             },
//             { rootMargin: "-20% 0px -70% 0px" }
//         )
//         allIds.forEach((id) => {
//             const el = document.getElementById(id)
//             if (el) observer.observe(el)
//         })
//         return () => observer.disconnect()
//     }, [])

//     return (
//         <div className="flex h-full justify-center">
//             <div className="flex w-full max-w-5xl">
//                 {/* Sidebar */}
//                 <aside className="hidden lg:flex flex-col w-56 shrink-0 border-r border-border sticky top-0 h-[calc(100vh-3.5rem)] overflow-y-auto py-6 px-3">
//                     <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground px-2 mb-3">
//                         Documentation
//                     </p>
//                     {NAV.map((section) => (
//                         <div key={section.id} className="mb-4">
//                             <div className="flex items-center gap-1.5 px-2 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
//                                 <section.icon className="h-3.5 w-3.5" />
//                                 {section.label}
//                             </div>
//                             {section.items.map((item) => (
//                                 <button
//                                     key={item.id}
//                                     onClick={() => scrollTo(item.id)}
//                                     className={cn(
//                                         "w-full text-left text-sm px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5",
//                                         activeId === item.id
//                                             ? "bg-primary/10 text-primary font-medium"
//                                             : "text-muted-foreground hover:text-foreground hover:bg-muted"
//                                     )}
//                                 >
//                                     {activeId === item.id && <IconChevronRight className="h-3 w-3 shrink-0" />}
//                                     {item.label}
//                                 </button>
//                             ))}
//                         </div>
//                     ))}
//                 </aside>

//                 {/* Content */}
//                 <main className="flex-1 overflow-y-auto px-6 lg:px-10 py-6 max-w-3xl">

//                     {/* ── Quickstart ── */}
//                     <Section id="quickstart-intro" title="Introduction">
//                         <SubSection id="quickstart-intro" title="What is Fire SMS?">
//                             <p className="text-sm text-muted-foreground leading-relaxed">
//                                 Fire SMS is a simple, developer-friendly API for sending SMS messages programmatically.
//                                 Authenticate with an API key, hit the REST endpoint, and your message is on its way.
//                             </p>
//                             <div className="mt-4 grid grid-cols-3 gap-3">
//                                 {[
//                                     { icon: IconBolt, label: "Fast delivery", desc: "Messages dispatched immediately" },
//                                     { icon: IconKey, label: "Secure", desc: "Hashed API keys, HTTPS only" },
//                                     { icon: IconMessage, label: "Simple API", desc: "One endpoint to send SMS" },
//                                 ].map((f) => (
//                                     <div key={f.label} className="border border-border rounded-lg p-3 flex flex-col gap-1">
//                                         <f.icon className="h-4 w-4 text-primary" />
//                                         <p className="text-sm font-medium">{f.label}</p>
//                                         <p className="text-xs text-muted-foreground">{f.desc}</p>
//                                     </div>
//                                 ))}
//                             </div>
//                         </SubSection>

//                         <SubSection id="quickstart-install" title="Installation">
//                             <p className="text-sm text-muted-foreground mb-2">
//                                 No SDK required — Fire SMS is a plain REST API. Use any HTTP client.
//                             </p>
//                             <CodeBlock lang="bash" code={`# Optional: install a lightweight HTTP client
// npm install axios        # Node.js
// pip install httpx        # Python`} />
//                             <p className="text-sm text-muted-foreground mt-2">
//                                 Your base URL for all requests:
//                             </p>
//                             <CodeBlock lang="text" code="https://yourdomain.com/api" />
//                         </SubSection>

//                         <SubSection id="quickstart-first" title="First Message">
//                             <p className="text-sm text-muted-foreground mb-2">
//                                 Generate an API key from the <strong>API Keys</strong> page, then send your first message:
//                             </p>
//                             <MultiLangBlock examples={{
//                                 curl: `curl -X POST https://yourdomain.com/api/messages \\
//   -H "Authorization: Bearer YOUR_API_KEY" \\
//   -H "Content-Type: application/json" \\
//   -d '{"recipient": "+27821234567", "body": "Hello from Fire SMS!"}'`,
//                                 js: `const res = await fetch("https://yourdomain.com/api/messages", {
//   method: "POST",
//   headers: {
//     "Authorization": "Bearer YOUR_API_KEY",
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({
//     recipient: "+27821234567",
//     body: "Hello from Fire SMS!",
//   }),
// });

// const { id } = await res.json();
// console.log("Message queued:", id);`,
//                                 python: `import httpx

// response = httpx.post(
//     "https://yourdomain.com/api/messages",
//     headers={"Authorization": "Bearer YOUR_API_KEY"},
//     json={"recipient": "+27821234567", "body": "Hello from Fire SMS!"},
// )

// print("Message queued:", response.json()["id"])`,
//                             }} />
//                             <div className="flex items-start gap-2 bg-green-500/10 border border-green-500/20 rounded-lg p-3 mt-2">
//                                 <IconCheck className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
//                                 <p className="text-sm text-green-700 dark:text-green-400">
//                                     A <code className="font-mono text-xs">201</code> response with an <code className="font-mono text-xs">id</code> means your message was queued successfully.
//                                 </p>
//                             </div>
//                         </SubSection>
//                     </Section>

//                     {/* ── Authentication ── */}
//                     <Section id="auth-overview" title="Authentication">
//                         <SubSection id="auth-overview" title="Overview">
//                             <p className="text-sm text-muted-foreground leading-relaxed">
//                                 All API requests must include a valid API key in the <code className="font-mono text-xs bg-muted px-1 py-0.5 rounded">Authorization</code> header
//                                 using the <strong>Bearer</strong> scheme. Keys are generated per-user and can be revoked at any time.
//                             </p>
//                             <CodeBlock lang="http" code={`Authorization: Bearer fsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`} />
//                             <div className="flex items-start gap-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mt-2">
//                                 <IconKey className="h-4 w-4 text-yellow-500 mt-0.5 shrink-0" />
//                                 <p className="text-sm text-yellow-700 dark:text-yellow-400">
//                                     Keep your API key secret. Never expose it in client-side code or public repositories.
//                                 </p>
//                             </div>
//                         </SubSection>

//                         <SubSection id="auth-create" title="Creating a Key">
//                             <p className="text-sm text-muted-foreground mb-3">
//                                 Navigate to <strong>API Keys</strong> in the sidebar and click <strong>New Key</strong>.
//                                 Give it a name (e.g. "Production"), then copy the key immediately — it will not be shown again.
//                             </p>
//                             <ol className="flex flex-col gap-2 text-sm text-muted-foreground list-none">
//                                 {[
//                                     "Go to API Keys in the sidebar",
//                                     "Click New Key",
//                                     "Enter a descriptive name",
//                                     "Copy the key — it's shown only once",
//                                     "Store it in an environment variable",
//                                 ].map((step, i) => (
//                                     <li key={i} className="flex items-center gap-3">
//                                         <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
//                                             {i + 1}
//                                         </span>
//                                         {step}
//                                     </li>
//                                 ))}
//                             </ol>
//                         </SubSection>

//                         <SubSection id="auth-usage" title="Using Your Key">
//                             <p className="text-sm text-muted-foreground mb-2">
//                                 Store your key as an environment variable and reference it in code — never hardcode it.
//                             </p>
//                             <MultiLangBlock examples={{
//                                 curl: `# Store in your shell
// export FIRESMS_API_KEY=fsk_xxxxxxxxxxxxxxxx

// # Use in requests
// curl -H "Authorization: Bearer $FIRESMS_API_KEY" \\
//   https://yourdomain.com/api/messages`,
//                                 js: `// .env.local
// // FIRESMS_API_KEY=fsk_xxxxxxxxxxxxxxxx

// const res = await fetch("https://yourdomain.com/api/messages", {
//   headers: {
//     "Authorization": \`Bearer \${process.env.FIRESMS_API_KEY}\`,
//   },
// });`,
//                                 python: `import os
// import httpx

// headers = {"Authorization": f"Bearer {os.environ['FIRESMS_API_KEY']}"}
// response = httpx.get("https://yourdomain.com/api/messages", headers=headers)`,
//                             }} />
//                         </SubSection>
//                     </Section>

//                     {/* ── API Reference ── */}
//                     <Section id="api-messages-list" title="API Reference">

//                         <SubSection id="api-messages-list" title="Messages">
//                             <Endpoint
//                                 method="GET"
//                                 path="/api/messages"
//                                 description="Returns all messages for the authenticated user, ordered by most recent."
//                                 response={`[
//   {
//     "id": "msg_abc123",
//     "recipient": "+27821234567",
//     "body": "Hello from Fire SMS!",
//     "status": "sent",
//     "created_at": 1718000000,
//     "updated_at": 1718000010
//   }
// ]`}
//                                 examples={{
//                                     curl: `curl https://yourdomain.com/api/messages \\
//   -H "Authorization: Bearer YOUR_API_KEY"`,
//                                     js: `const res = await fetch("/api/messages", {
//   headers: { "Authorization": "Bearer YOUR_API_KEY" },
// });
// const messages = await res.json();`,
//                                     python: `import httpx
// r = httpx.get(
//     "https://yourdomain.com/api/messages",
//     headers={"Authorization": "Bearer YOUR_API_KEY"},
// )
// messages = r.json()`,
//                                 }}
//                             />
//                         </SubSection>

//                         <SubSection id="api-messages-send" title="">
//                             <Endpoint
//                                 method="POST"
//                                 path="/api/messages"
//                                 description="Queue a new SMS message for delivery."
//                                 body={[
//                                     { name: "recipient", type: "string", required: true, desc: "E.164 formatted phone number e.g. +27821234567" },
//                                     { name: "body", type: "string", required: true, desc: "Message content, max 160 characters" },
//                                 ]}
//                                 response={`{ "id": "msg_abc123" }`}
//                                 examples={{
//                                     curl: `curl -X POST https://yourdomain.com/api/messages \\
//   -H "Authorization: Bearer YOUR_API_KEY" \\
//   -H "Content-Type: application/json" \\
//   -d '{"recipient": "+27821234567", "body": "Hello!"}'`,
//                                     js: `const res = await fetch("/api/messages", {
//   method: "POST",
//   headers: {
//     "Authorization": "Bearer YOUR_API_KEY",
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({ recipient: "+27821234567", body: "Hello!" }),
// });
// const { id } = await res.json();`,
//                                     python: `r = httpx.post(
//     "https://yourdomain.com/api/messages",
//     headers={"Authorization": "Bearer YOUR_API_KEY"},
//     json={"recipient": "+27821234567", "body": "Hello!"},
// )
// message_id = r.json()["id"]`,
//                                 }}
//                             />
//                         </SubSection>

//                         <SubSection id="api-messages-delete" title="">
//                             <Endpoint
//                                 method="DELETE"
//                                 path="/api/messages/:id"
//                                 description="Permanently delete a message record. You can only delete your own messages."
//                                 response={`{ "success": true }`}
//                                 examples={{
//                                     curl: `curl -X DELETE https://yourdomain.com/api/messages/msg_abc123 \\
//   -H "Authorization: Bearer YOUR_API_KEY"`,
//                                     js: `await fetch("/api/messages/msg_abc123", {
//   method: "DELETE",
//   headers: { "Authorization": "Bearer YOUR_API_KEY" },
// });`,
//                                     python: `httpx.delete(
//     "https://yourdomain.com/api/messages/msg_abc123",
//     headers={"Authorization": "Bearer YOUR_API_KEY"},
// )`,
//                                 }}
//                             />
//                         </SubSection>

//                         <SubSection id="api-keys-list" title="API Keys">
//                             <Endpoint
//                                 method="GET"
//                                 path="/api/api-keys"
//                                 description="List all API keys for your account. Key values are never returned — only metadata."
//                                 response={`[
//   {
//     "id": "key_abc123",
//     "name": "Production",
//     "last_used_at": 1718000000,
//     "created_at": 1717000000
//   }
// ]`}
//                                 examples={{
//                                     curl: `curl https://yourdomain.com/api/api-keys \\
//   -H "Authorization: Bearer YOUR_API_KEY"`,
//                                     js: `const res = await fetch("/api/api-keys", {
//   headers: { "Authorization": "Bearer YOUR_API_KEY" },
// });
// const keys = await res.json();`,
//                                     python: `r = httpx.get(
//     "https://yourdomain.com/api/api-keys",
//     headers={"Authorization": "Bearer YOUR_API_KEY"},
// )`,
//                                 }}
//                             />
//                         </SubSection>

//                         <SubSection id="api-keys-create" title="">
//                             <Endpoint
//                                 method="POST"
//                                 path="/api/api-keys"
//                                 description="Create a new API key. The raw key is returned once and cannot be retrieved again."
//                                 body={[
//                                     { name: "name", type: "string", required: true, desc: "Human-readable label for this key" },
//                                     { name: "expiresAt", type: "number", required: false, desc: "Unix timestamp when this key expires" },
//                                 ]}
//                                 response={`{
//   "id": "key_abc123",
//   "key": "fsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
// }`}
//                                 examples={{
//                                     curl: `curl -X POST https://yourdomain.com/api/api-keys \\
//   -H "Authorization: Bearer YOUR_API_KEY" \\
//   -H "Content-Type: application/json" \\
//   -d '{"name": "My App"}'`,
//                                     js: `const res = await fetch("/api/api-keys", {
//   method: "POST",
//   headers: {
//     "Authorization": "Bearer YOUR_API_KEY",
//     "Content-Type": "application/json",
//   },
//   body: JSON.stringify({ name: "My App" }),
// });
// const { id, key } = await res.json();
// // Store key securely — shown once only`,
//                                     python: `r = httpx.post(
//     "https://yourdomain.com/api/api-keys",
//     headers={"Authorization": "Bearer YOUR_API_KEY"},
//     json={"name": "My App"},
// )
// key = r.json()["key"]  # Store this securely`,
//                                 }}
//                             />
//                         </SubSection>

//                         <SubSection id="api-keys-delete" title="">
//                             <Endpoint
//                                 method="DELETE"
//                                 path="/api/api-keys/:id"
//                                 description="Revoke an API key immediately. Any requests using this key will fail after deletion."
//                                 response={`{ "success": true }`}
//                                 examples={{
//                                     curl: `curl -X DELETE https://yourdomain.com/api/api-keys/key_abc123 \\
//   -H "Authorization: Bearer YOUR_API_KEY"`,
//                                     js: `await fetch("/api/api-keys/key_abc123", {
//   method: "DELETE",
//   headers: { "Authorization": "Bearer YOUR_API_KEY" },
// });`,
//                                     python: `httpx.delete(
//     "https://yourdomain.com/api/api-keys/key_abc123",
//     headers={"Authorization": "Bearer YOUR_API_KEY"},
// )`,
//                                 }}
//                             />
//                         </SubSection>
//                     </Section>

//                     {/* ── Code Examples ── */}
//                     <Section id="examples-send" title="Code Examples">
//                         <SubSection id="examples-send" title="Send an SMS">
//                             <p className="text-sm text-muted-foreground mb-2">
//                                 A complete end-to-end example of sending a single message and checking the result.
//                             </p>
//                             <MultiLangBlock examples={{
//                                 curl: `# Send message
// curl -X POST https://yourdomain.com/api/messages \\
//   -H "Authorization: Bearer $FIRESMS_API_KEY" \\
//   -H "Content-Type: application/json" \\
//   -d '{"recipient": "+27821234567", "body": "Your OTP is 482910"}'

// # Check message status
// curl https://yourdomain.com/api/messages/MSG_ID \\
//   -H "Authorization: Bearer $FIRESMS_API_KEY"`,
//                                 js: `async function sendSMS(recipient, body) {
//   const res = await fetch("https://yourdomain.com/api/messages", {
//     method: "POST",
//     headers: {
//       "Authorization": \`Bearer \${process.env.FIRESMS_API_KEY}\`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ recipient, body }),
//   });

//   if (!res.ok) {
//     throw new Error(\`Failed: \${res.status}\`);
//   }

//   const { id } = await res.json();
//   console.log("Queued message:", id);
//   return id;
// }

// await sendSMS("+27821234567", "Your OTP is 482910");`,
//                                 python: `import httpx
// import os

// def send_sms(recipient: str, body: str) -> str:
//     r = httpx.post(
//         "https://yourdomain.com/api/messages",
//         headers={
//             "Authorization": f"Bearer {os.environ['FIRESMS_API_KEY']}",
//             "Content-Type": "application/json",
//         },
//         json={"recipient": recipient, "body": body},
//     )
//     r.raise_for_status()
//     return r.json()["id"]

// msg_id = send_sms("+27821234567", "Your OTP is 482910")
// print(f"Queued: {msg_id}")`,
//                             }} />
//                         </SubSection>

//                         <SubSection id="examples-bulk" title="Bulk Sending">
//                             <p className="text-sm text-muted-foreground mb-2">
//                                 Send to multiple recipients by looping over the send endpoint. Add a small delay to avoid rate limits.
//                             </p>
//                             <MultiLangBlock examples={{
//                                 curl: `# Loop through numbers in a file
// while IFS= read -r number; do
//   curl -s -X POST https://yourdomain.com/api/messages \\
//     -H "Authorization: Bearer $FIRESMS_API_KEY" \\
//     -H "Content-Type: application/json" \\
//     -d "{\"recipient\": \"$number\", \"body\": \"Your message here\"}"
//   sleep 0.2
// done < numbers.txt`,
//                                 js: `const recipients = ["+27821234567", "+27831234567", "+27841234567"];

// async function sleep(ms) {
//   return new Promise((r) => setTimeout(r, ms));
// }

// for (const recipient of recipients) {
//   await fetch("https://yourdomain.com/api/messages", {
//     method: "POST",
//     headers: {
//       "Authorization": \`Bearer \${process.env.FIRESMS_API_KEY}\`,
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({ recipient, body: "Bulk message here" }),
//   });
//   await sleep(200); // 200ms between requests
// }`,
//                                 python: `import httpx
// import time
// import os

// recipients = ["+27821234567", "+27831234567", "+27841234567"]

// with httpx.Client() as client:
//     for recipient in recipients:
//         r = client.post(
//             "https://yourdomain.com/api/messages",
//             headers={"Authorization": f"Bearer {os.environ['FIRESMS_API_KEY']}"},
//             json={"recipient": recipient, "body": "Bulk message here"},
//         )
//         r.raise_for_status()
//         time.sleep(0.2)  # 200ms between requests`,
//                             }} />
//                         </SubSection>

//                         <SubSection id="examples-webhook" title="Status Polling">
//                             <p className="text-sm text-muted-foreground mb-2">
//                                 Poll a message's status until it transitions from <code className="font-mono text-xs bg-muted px-1 rounded">pending</code> to <code className="font-mono text-xs bg-muted px-1 rounded">sent</code> or <code className="font-mono text-xs bg-muted px-1 rounded">failed</code>.
//                             </p>
//                             <MultiLangBlock examples={{
//                                 curl: `# Poll every 2 seconds (replace MSG_ID)
// while true; do
//   STATUS=$(curl -s https://yourdomain.com/api/messages/MSG_ID \\
//     -H "Authorization: Bearer $FIRESMS_API_KEY" | jq -r '.status')
//   echo "Status: $STATUS"
//   if [ "$STATUS" != "pending" ]; then break; fi
//   sleep 2
// done`,
//                                 js: `async function pollStatus(messageId, intervalMs = 2000) {
//   while (true) {
//     const res = await fetch(\`/api/messages/\${messageId}\`, {
//       headers: { "Authorization": \`Bearer \${process.env.FIRESMS_API_KEY}\` },
//     });
//     const { status } = await res.json();
//     console.log("Status:", status);

//     if (status !== "pending") return status;
//     await new Promise((r) => setTimeout(r, intervalMs));
//   }
// }

// const finalStatus = await pollStatus("msg_abc123");
// console.log("Final:", finalStatus); // "sent" or "failed"`,
//                                 python: `import httpx
// import time
// import os

// def poll_status(message_id: str, interval: float = 2.0) -> str:
//     with httpx.Client() as client:
//         while True:
//             r = client.get(
//                 f"https://yourdomain.com/api/messages/{message_id}",
//                 headers={"Authorization": f"Bearer {os.environ['FIRESMS_API_KEY']}"},
//             )
//             status = r.json()["status"]
//             print(f"Status: {status}")
//             if status != "pending":
//                 return status
//             time.sleep(interval)

// final = poll_status("msg_abc123")
// print(f"Final: {final}")`,
//                             }} />
//                         </SubSection>
//                     </Section>
//                 </main>
//             </div>
//         </div>
//     )
// }

import React from 'react'

export default function page() {
  return (
    <div>
      Coming Soon
    </div>
  )
}
