import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn
import os

doc = docx.Document()

# Page setup (Standard Letter, 0.85-inch margins for professional balance)
for section in doc.sections:
    section.top_margin = Inches(0.85)
    section.bottom_margin = Inches(0.85)
    section.left_margin = Inches(0.85)
    section.right_margin = Inches(0.85)

# Typography
FONT_NAME = 'Segoe UI'

# SHAGHOOF Brand Color Palette
PRIMARY_BRAND = RGBColor(232, 111, 31)     # #E86F1F (Deep vibrant warm orange - primary brand)
BRAND_ACCENT = RGBColor(255, 61, 46)      # #FF3D2E (Vibrant tomato red / coral)
BRAND_PEACH = RGBColor(255, 138, 61)      # #FF8A3D (Rich warm peach-orange)
TEXT_DARK = RGBColor(30, 41, 59)          # #1E293B (Slate dark text)
MUTED_GRAY = RGBColor(100, 116, 139)      # #64748B (Slate muted)

# Hex Colors for XML Shading
BRAND_HEADER_HEX = "E86F1F"               # Primary table header background
BRAND_ROW_ALT_HEX = "FFF8F2"              # Warm peach-white alternating rows (--nynatrema-60)
BRAND_HIGHLIGHT_HEX = "FFEDD5"            # Soft amber highlight
BORDER_COLOR_HEX = "FED7AA"               # Warm amber border

def set_cell_shading(cell, color_hex):
    shading_elm = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{color_hex}"/>')
    cell._tc.get_or_add_tcPr().append(shading_elm)

def prevent_row_split(table):
    for row in table.rows:
        trPr = row._tr.get_or_add_trPr()
        trPr.append(OxmlElement('w:cantSplit'))

def set_repeat_header(table):
    header_tr = table.rows[0]._tr.get_or_add_trPr()
    header_tr.append(OxmlElement('w:tblHeader'))

def add_heading_with_bottom_border(text, level=1):
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(14)
    h.paragraph_format.space_after = Pt(5)
    h.paragraph_format.keep_with_next = True
    run = h.add_run(text)
    run.font.name = FONT_NAME
    run.font.size = Pt(15 if level == 1 else 12.5)
    run.font.bold = True
    run.font.color.rgb = PRIMARY_BRAND
    
    if level == 1:
        pPr = h._p.get_or_add_pPr()
        pBdr = parse_xml(f'<w:pBdr {nsdecls("w")}><w:bottom w:val="single" w:sz="12" w:space="4" w:color="E86F1F"/></w:pBdr>')
        pPr.append(pBdr)
    return h

def add_p(text, bold_prefix="", space_after=5, italic=False, keep_with_next=False):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15
    if keep_with_next:
        p.paragraph_format.keep_with_next = True
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = 'Calibri'
        r_pre.font.size = Pt(10)
        r_pre.font.bold = True
        r_pre.font.color.rgb = TEXT_DARK
    if text:
        r = p.add_run(text)
        r.font.name = 'Calibri'
        r.font.size = Pt(10)
        r.font.italic = italic
        r.font.color.rgb = TEXT_DARK
    return p

def add_bullet(text, bold_prefix=""):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.15
    # Clean any accidental bullet character from bold_prefix
    clean_prefix = bold_prefix.lstrip('• ').strip()
    if clean_prefix:
        r_pre = p.add_run(clean_prefix + " ")
        r_pre.font.name = 'Calibri'
        r_pre.font.size = Pt(10)
        r_pre.font.bold = True
        r_pre.font.color.rgb = TEXT_DARK
    r = p.add_run(text)
    r.font.name = 'Calibri'
    r.font.size = Pt(10)
    r.font.color.rgb = TEXT_DARK
    return p

def add_table_from_data(data, col_widths=None):
    """Helper to create consistently styled tables."""
    table = doc.add_table(rows=len(data), cols=len(data[0]))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    prevent_row_split(table)
    set_repeat_header(table)
    for r_idx, row in enumerate(data):
        for c_idx, val in enumerate(row):
            cell = table.cell(r_idx, c_idx)
            cell.text = val
            p = cell.paragraphs[0]
            p.paragraph_format.space_before = Pt(2)
            p.paragraph_format.space_after = Pt(2)
            run = p.runs[0]
            run.font.name = FONT_NAME
            run.font.size = Pt(8.5)
            if r_idx == 0:
                run.font.bold = True
                run.font.color.rgb = RGBColor(255, 255, 255)
                set_cell_shading(cell, BRAND_HEADER_HEX)
            else:
                run.font.color.rgb = TEXT_DARK
                set_cell_shading(cell, BRAND_ROW_ALT_HEX if r_idx % 2 == 1 else "FFFFFF")
    return table

# ── PAGE 1: TITLE / COVER (SHAGHOOF BRANDED) ──────────────────────────
# Logo Mark
p_logo = doc.add_paragraph()
p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_logo.paragraph_format.space_before = Pt(70)
p_logo.paragraph_format.space_after = Pt(14)
if os.path.exists('public/brand/shaghoof-mark-clear.png'):
    p_logo.add_run().add_picture('public/brand/shaghoof-mark-clear.png', width=Inches(1.85))

p_title = doc.add_paragraph()
p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_title.paragraph_format.space_after = Pt(4)
r_title = p_title.add_run("SHAGHOOF AI\n")
r_title.font.name = FONT_NAME
r_title.font.size = Pt(30)
r_title.font.bold = True
r_title.font.color.rgb = PRIMARY_BRAND

p_sub = doc.add_paragraph()
p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_sub.paragraph_format.space_after = Pt(8)
r_sub = p_sub.add_run("Adaptive AI-Powered Education Platform\n")
r_sub.font.name = FONT_NAME
r_sub.font.size = Pt(14)
r_sub.font.bold = True
r_sub.font.color.rgb = TEXT_DARK

p_tagline = doc.add_paragraph()
p_tagline.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_tagline.paragraph_format.space_after = Pt(80)
r_tag = p_tagline.add_run("Accessible, multimodal learning built from your own course materials")
r_tag.font.name = FONT_NAME
r_tag.font.size = Pt(11)
r_tag.font.italic = True
r_tag.font.color.rgb = MUTED_GRAY

p_meta = doc.add_paragraph()
p_meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_meta.paragraph_format.space_after = Pt(6)
r_meta1 = p_meta.add_run("Graduation Project Proposal\n")
r_meta1.font.name = FONT_NAME
r_meta1.font.size = Pt(13)
r_meta1.font.bold = True
r_meta1.font.color.rgb = BRAND_ACCENT

p_meta2 = doc.add_paragraph()
p_meta2.alignment = WD_ALIGN_PARAGRAPH.CENTER
r_sup = p_meta2.add_run("Academic Supervisor: Dr. Mahmoud Sami\n")
r_sup.font.name = FONT_NAME
r_sup.font.size = Pt(11)
r_sup.font.bold = True
r_sup.font.color.rgb = TEXT_DARK

r_team = p_meta2.add_run("Team Leader: Yusuf Adel Abbas (20235824)\n")
r_team.font.name = FONT_NAME
r_team.font.size = Pt(10)
r_team.font.color.rgb = MUTED_GRAY

r_year = p_meta2.add_run("Academic Year 2025 – 2026")
r_year.font.name = FONT_NAME
r_year.font.size = Pt(9.5)
r_year.font.color.rgb = MUTED_GRAY

doc.add_page_break()

# ── PAGE 2: TABLE OF CONTENTS ──────────────────────────────────────
# FIX #2: Added missing sections (Related Work, Evaluation, Limitations, Timeline, References)
add_heading_with_bottom_border("Table of Contents", 1)
toc_items = [
    "1. Overview",
    "2. Problem Statement & Motivation",
    "3. Related Work",
    "4. Project Objectives",
    "5. Key Features",
    "6. System Architecture & Diagrams",
    "7. Technology Stack",
    "8. Implementation Overview",
    "9. Testing & Quality Assurance",
    "10. Security, Privacy & Threat Model",
    "11. Evaluation Methodology",
    "12. Estimated Unit Economics & Business Model",
    "13. Limitations & Future Work",
    "14. Timeline & Milestones",
    "15. Team & Project Information",
    "16. References"
]
for item in toc_items:
    p_toc = doc.add_paragraph()
    p_toc.paragraph_format.space_after = Pt(4)
    r_toc = p_toc.add_run(item)
    r_toc.font.name = FONT_NAME
    r_toc.font.size = Pt(11)
    r_toc.font.color.rgb = TEXT_DARK

doc.add_page_break()

# ── SECTION 1 & 2: OVERVIEW & MOTIVATION ────────────────────────────
# FIX #1, #3, #4: Removed 'enterprise-grade', replaced VARK with UDL, removed 'cognitive style'
add_heading_with_bottom_border("1. Overview", 1)
add_p("SHAGHOOF AI is an AI-powered adaptive education platform that transforms how students learn by generating multiple accessible representations of course content following Universal Design for Learning (UDL) principles. The platform dynamically converts text-based PDF course material into visual, audio, textual, and interactive formats, allowing each student to choose the representation that suits their context and preference.")
add_p("The platform integrates directly with Moodle LMS, enabling seamless course synchronization, and provides an AI tutor powered by Retrieval-Augmented Generation (RAG) that answers student questions using their actual course documents with verifiable source citations. Beyond multimodal content delivery, SHAGHOOF AI embeds a comprehensive accessibility layer with full native Right-to-Left (RTL) Arabic typography, so that students with visual or reading impairments can engage with the same course content as every other student.")

add_heading_with_bottom_border("2. Problem Statement & Motivation", 1)
add_p("Higher-education platforms such as Moodle deliver the same static PDF or slide content to every student, regardless of that student's context, preference, or access needs. This one-size-fits-all model creates two closely related problems:")

# FIX #6: Retitled to 'Static content offers a single mode of access'
add_p("", bold_prefix="2.1 Static content offers a single mode of access", keep_with_next=True)
# FIX #4, #6: Argued from access and preference, not from learning types
add_p("Students benefit from accessing content in different formats depending on their context: a student commuting may prefer to review material via audio narration; another may understand a concept better through an interactive diagram than a paragraph of text. When course material is locked into a single static format (a PDF), students who would benefit from alternative representations have fewer opportunities to engage with the material effectively.")

# FIX #7: Softened claim, noted need for evidence
add_p("", bold_prefix="2.2 Students with disabilities face significant access barriers", keep_with_next=True)
add_p("According to Egypt's Central Agency for Public Mobilization and Statistics (CAPMAS), approximately 10.7% of the population has a disability (2017 Census), yet accessibility support in mainstream educational technology remains limited. Common barriers include:")

add_bullet("Flat PDF text and images are unreadable without screen-reader support and spoken narration of visual content.", bold_prefix="Visual impairments (low vision or blindness):")
add_bullet("Audio lectures and video narration are inaccessible without captions and transcripts.", bold_prefix="Hearing impairments (deaf or hard-of-hearing):")
add_bullet("Dense standard fonts and low-contrast text materially slow down reading comprehension.", bold_prefix="Dyslexia and other reading difficulties:")
# FIX #10: Clarified colorblind filter purpose
add_bullet("Diagrams and charts that rely solely on color coding (e.g. red/green indicators) are misread. WCAG 1.4.1 requires that color is never the sole means of conveying information; the platform uses labels, patterns, and shapes alongside color.", bold_prefix="Color-vision deficiencies:")
# FIX #12: Replaced Dwell-Click/AAC with keyboard operability
add_bullet("Full keyboard operability, visible focus indicators, and adequate target sizes (WCAG 2.5.8) are essential for students using switch access, voice control, or other alternative input methods.", bold_prefix="Motor impairments:")

# FIX #8: Removed overclaim, acknowledged existing tools, stated SHAGHOOF's differentiators
add_p("", bold_prefix="2.3 Motivation", keep_with_next=True)
# FIX #9: Changed 'the same problem' to 'closely related'
add_p("SHAGHOOF AI was motivated by the observation that multimodal content delivery and accessibility are closely related challenges. Several existing tools address parts of this space — Anthology Ally generates alternative formats from LMS files, Moodle includes the Brickfield accessibility toolkit, and Google NotebookLM produces audio overviews. However, none of these tools combine course-grounded AI tutoring with source citations, Egyptian Arabic dialect support, AI-generated descriptions of figures and equations readable by screen readers, and a comprehensive accessibility layer in a single platform integrated with Moodle. Section 3 (Related Work) provides a detailed comparison. Concretely, the platform addresses access needs by:")

add_bullet("Converting lesson content into spoken narration and a dual-host educational podcast, so material can be fully consumed by ear — a key channel for visually impaired or reading-fatigued students.")
add_bullet("Providing screen-reader-optimized semantic structure, an OpenDyslexic font mode, a line-focus reading ruler, and adjustable text size/contrast for low-vision and dyslexic students.")
# FIX #10: Updated colorblindness description
add_bullet("Providing colorblindness correction modes and ensuring all diagrams use color-independent indicators (labels, patterns, shapes) per WCAG 1.4.1.")
# FIX #11: Removed 3D sign language, replaced with captions/transcripts
add_bullet("Providing synchronized captions and transcripts for all audio and podcast content, supporting deaf and hard-of-hearing students. (Automated sign-language generation is deferred to future work due to the lack of mature Egyptian Sign Language (ESL) models.)")
# FIX #12: Replaced AAC/Dwell-Click with keyboard operability
add_bullet("Ensuring full keyboard operability, visible focus indicators, adequate touch/click target sizes (WCAG 2.5.8), and compatibility with OS-level switch and voice control for students with motor impairments.")

add_p("This aligns the project with UN Sustainable Development Goal 4 (Quality Education) and Goal 10 (Reduced Inequalities).")

doc.add_page_break()

# ── SECTION 3: RELATED WORK (NEW — FIX #2, #8, #27) ────────────────
add_heading_with_bottom_border("3. Related Work", 1)
add_p("The following table compares SHAGHOOF AI against existing tools that address multimodal content delivery or accessibility in education:")

related_work = [
    ("Tool / Platform", "Multimodal from PDFs", "Course-Grounded AI Tutor", "Egyptian Arabic", "Accessibility Suite", "Moodle Integration"),
    ("Google NotebookLM", "Audio overview only", "Yes (general)", "Limited", "No dedicated suite", "No"),
    ("Anthology Ally", "Audio, ePub, tagged PDF", "No", "No", "Alternative formats", "Yes (plugin)"),
    ("Moodle + Brickfield", "No generation", "No", "Partial (UI only)", "Audit toolkit", "Native"),
    ("Microsoft Immersive Reader", "Read-aloud, translation", "No", "MSA only", "Reading tools", "No"),
    ("SHAGHOOF AI (Ours)", "Visual, Audio, Text, Interactive from any text-based PDF", "Yes — RAG with page citations, retrieval-confidence abstention", "Egyptian dialect + MSA", "RTL, OpenDyslexic, contrast, screen-reader, keyboard access, figure descriptions", "Native Moodle Web Services + planned LTI 1.3")
]
t_rw = doc.add_table(rows=len(related_work), cols=6)
t_rw.alignment = WD_TABLE_ALIGNMENT.CENTER
prevent_row_split(t_rw)
set_repeat_header(t_rw)
for r_idx, row in enumerate(related_work):
    for c_idx, val in enumerate(row):
        cell = t_rw.cell(r_idx, c_idx)
        cell.text = val
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        run = p.runs[0]
        run.font.name = FONT_NAME
        run.font.size = Pt(7.5)
        if r_idx == 0:
            run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)
            set_cell_shading(cell, BRAND_HEADER_HEX)
        elif r_idx == len(related_work) - 1:
            run.font.bold = True
            run.font.color.rgb = PRIMARY_BRAND
            set_cell_shading(cell, BRAND_HIGHLIGHT_HEX)
        else:
            run.font.color.rgb = TEXT_DARK
            set_cell_shading(cell, BRAND_ROW_ALT_HEX if r_idx % 2 == 1 else "FFFFFF")

add_p("SHAGHOOF AI's primary contributions over existing tools are: (1) generating multiple content representations from Moodle course PDFs following UDL principles, (2) a RAG-based AI tutor that answers strictly from the student's own course documents with page-numbered citations and retrieval-confidence abstention, (3) native Egyptian Arabic dialect support in both text and speech, and (4) AI-generated descriptions of figures, diagrams, and equations in Arabic/English for screen-reader users.")

doc.add_page_break()

# ── SECTION 4: OBJECTIVES ──────────────────────────────────────────
# FIX #4, #13, #14, #15, #17, #18: Rewritten with UDL, narrowed scope, added evaluation objective
add_heading_with_bottom_border("4. Project Objectives", 1)
add_p("The project has the following core objectives:")
objectives = [
    # FIX #4, #13: UDL framing
    "Generate multiple accessible representations (text, audio, visual, interactive) of text-based course PDFs following Universal Design for Learning (UDL) principles, allowing each student to choose the format that suits them.",
    "Integrate natively with Moodle LMS so existing course material can be discovered, synced, and processed with zero manual re-uploading by instructors or students.",
    "Deliver an accurate, citation-grounded AI tutor (RAG pipeline) that answers student questions strictly from their own course documents, minimizing hallucination and building trust.",
    # FIX #11, #12, #14: Narrowed to blind/low-vision, removed sign language, removed AAC
    "Provide an accessibility layer focused on blind and low-vision students: screen-reader support with AI-generated figure/equation descriptions, native RTL Arabic typography, an OpenDyslexic font mode, adjustable contrast/text sizing, and full keyboard operability — evaluated against WCAG 2.2 Level AA.",
    "Increase engagement and retention through innovative tools: a dual-host educational podcast (Dr. Yusuf & Mariam), an interactive concept knowledge graph, AI-generated reinforcement games, and a 'Reverse Feynman' teach-back challenge.",
    # FIX #15: 'measure and report' instead of 'guarantee'
    "Measure and report AI answer quality on a documented benchmark using quantitative RAG evaluation metrics (faithfulness, context precision, answer relevance) with published methodology.",
    # FIX #16: Softened, instructor-approved
    "Implement an instructor intelligence portal for misconception tracking and at-risk indicators, with all interventions requiring instructor approval.",
    "Align the platform's design and outcomes with UN SDG 4 (Quality Education) and SDG 10 (Reduced Inequalities).",
    # FIX #17: Changed 'production-ready' to 'deployable pilot'
    "Ship a secure, deployable pilot (rate limiting, SSRF protection, input sanitization, per-user data isolation) with a documented path to containerized production deployment.",
    # FIX #18: Added evaluation objective
    "Conduct a learning-outcome evaluation comparing plain PDF study against the platform (pre/post test) and a usability study with students from the target accessibility group."
]
for idx, obj in enumerate(objectives):
    add_p(f"{idx+1}. {obj}", space_after=2.5)

doc.add_page_break()

# ── SECTION 5: KEY FEATURES ─────────────────────────────────────────
add_heading_with_bottom_border("5. Key Features", 1)
# FIX #19: Renamed 'Championship Suite' to 'Core Innovations'
add_p("", bold_prefix="5.1 Core Innovations", keep_with_next=True)
# FIX #20: Toned down language
add_p("The platform introduces five specialized features for AI-driven, accessible education:")

add_p("1. Dual-Host Educational Podcast", bold_prefix="", keep_with_next=True)
# FIX #22: Named hosts explicitly (Dr. Yusuf & Mariam)
add_bullet("Dual AI hosts — SHAGHOOF and USER discuss each lecture in conversational depth. The hosts are presented in the UI as Dr. Yusuf and Mariam, representing an instructor and a curious student.")
# FIX #23: Removed 'seamlessly', noted need for listening test
add_bullet("Switches between Egyptian conversational Arabic and Academic Standard Arabic. Dialect quality and pronunciation accuracy of technical terms will be evaluated via student listening tests (MOS ratings) as part of the usability study (Objective 10).")
add_bullet("Real-time audio waveform with speech synthesis, pitch variation, adjustable speed (1x/1.25x/1.5x), and live script sync — a key accessibility channel for visually impaired or reading-fatigued students.")
# FIX #21: Explicitly compared with NotebookLM
add_p("Compared to Google NotebookLM's audio overviews, SHAGHOOF's podcast adds: grounding in Moodle-specific course files, Egyptian Arabic dialect, synchronized transcript for screen readers, and instructor-controllable content scope.", italic=True, space_after=3)

add_p("2. RAG Evaluation & Retrieval-Confidence Abstention", bold_prefix="", keep_with_next=True)
# FIX #24: Removed unexplained numbers, described methodology
add_bullet("Ragas / RAG-Triad style quantitative evaluation (Faithfulness, Context Precision, Answer Relevance). Detailed methodology, dataset, and results are reported in Section 11 (Evaluation).")
# FIX #25: Separated latency metrics properly
add_bullet("Latency targets: FAISS retrieval p50 < 20ms, Groq time-to-first-token p50 < 100ms, full streamed response p50 < 2s. Measured via server-side instrumentation on a documented test set.")
# FIX #26: Removed 'zero-hallucination', renamed correctly
add_bullet("Retrieval-confidence threshold (cosine >= 0.72) with safe abstention: if no retrieved chunk exceeds the threshold, the tutor responds 'This information was not found in your course material' rather than generating an ungrounded answer. Citation validation cross-checks the generated answer against source chunks. The measured hallucination rate is reported in Section 11.")

add_p("3. Interactive Concept Knowledge Graph", bold_prefix="", keep_with_next=True)
# FIX #27: Clarified how graph is built
add_bullet("Concept network extracted from course PDFs via LLM-based entity and relationship extraction. Concepts and prerequisite links are validated against the source document headings and definitions.")
add_bullet("Interactive node inspector showing formal definitions, formulas, and prerequisite learning paths.")
# FIX #27: Removed '3D', consistent with Mermaid/SVG stack
add_bullet("One click on any node launches that concept's multimodal lesson. Rendered via Mermaid.js and Interactive SVG (consistent with the technology stack).")

add_p("4. Reverse Feynman Challenge", bold_prefix="", keep_with_next=True)
add_bullet("The AI challenges the student: \"Explain Backpropagation as if teaching your grandma or a 9-year-old.\"")
add_bullet("Speech recognition and text analysis evaluate the student's own explanation.")
# FIX #28: Added correctness check and defined metrics
add_bullet("Metrics: Simplicity Score (0-100%), Jargon Density Index, and a Correctness Check against course content. Each metric computation is documented. Scores will be compared with instructor grading on a 30-explanation sample.")

# FIX #29: Separated AI games from Wordwall embedding
add_p("5. AI-Generated Reinforcement Games & Wordwall Integration", bold_prefix="", keep_with_next=True)
add_bullet("AI-generated interactive mini-games (match-up, anagrams, word search) synthesized directly from each lesson's vocabulary using the course PDF content.", bold_prefix="AI Mini-Games:")
add_bullet("Optional embedding of external Wordwall activities (wordwall.net/resource/* and play/*) linked by the instructor for additional practice.", bold_prefix="Wordwall Integration:")

# FIX #30: Renamed VARK-based to Multimodal
add_p("", bold_prefix="5.2 Core Platform Features", keep_with_next=True)
add_p("Multimodal Content Delivery", bold_prefix="", keep_with_next=True)
add_bullet("UDL-based content delivery: visual diagrams, audio narration, text prose, and interactive exercises.")
add_bullet("Dynamic representation switching with smooth animated transitions.")
add_bullet("AI-generated lesson content adapted directly from actual course PDFs, with step-by-step progression and progress tracking.")

add_p("Moodle LMS Integration", bold_prefix="", keep_with_next=True)
# FIX #31: Added note about token UX and LTI 1.3
add_bullet("Moodle connection via Web Service token with a step-by-step guided setup flow. Tokens are encrypted at rest (AES-256) and scoped to read-only course access where possible.")
add_bullet("Automatic course-enrollment sync showing all enrolled courses.")
add_bullet("Intelligent PDF detection across all course sections, with batch download and background processing.")
add_p("Planned: LTI 1.3 integration as the standard, university-approved method for connecting external tools to Moodle, Canvas, and Blackboard (see Roadmap).", italic=True, space_after=3)

add_p("RAG-Powered AI Tutor", bold_prefix="", keep_with_next=True)
add_bullet("Context-aware Q&A grounded strictly in the student's own course documents, with page-numbered source citations.")
# FIX #32: Changed per-user to per-course with per-user private workspace
add_bullet("Per-course shared knowledge base (to avoid duplicate embedding costs) with enrollment-based access control. Per-user private workspace for uploaded files and chat history.")
# FIX #33: Fixed model names
add_bullet("FAISS vector store with multilingual sentence-transformer embeddings and Groq Cloud multi-model inference (Llama 3.3 70B for deep reasoning, Llama 3.1 8B for fast tasks).")

# FIX #57: Labeled general vs grounded tutor clearly
add_p("", bold_prefix="Note on General vs. Grounded Tutor:", keep_with_next=True)
add_p("The platform provides two tutor modes: (1) a RAG-grounded tutor (/chat/tutor/rag) that answers strictly from course documents with citations, and (2) a general tutor (/chat/tutor) for open-ended questions. Responses from the general tutor are clearly labeled in the interface as 'General AI Answer — not sourced from your course material' to avoid confusion.", italic=True)

add_p("Accessibility & BiDi First", bold_prefix="", keep_with_next=True)
add_bullet("Native Right-to-Left (RTL) & BiDirectional (BiDi) layout engine with specialized Arabic typography.")
add_bullet("Comprehensive accessibility toolbar: font sizing, high-contrast, line ruler, dyslexia-friendly font, reduced-motion support.")
add_bullet("Screen-reader-optimized semantic HTML throughout the interface.")
# FIX #35: Added AI figure descriptions
add_bullet("AI-generated descriptions of figures, diagrams, and equations in Arabic and English, readable by screen readers — addressing the critical gap where narrating text alone leaves blind students without most technical content.")

add_p("Gamification & Analytics", bold_prefix="", keep_with_next=True)
add_bullet("Real-time XP leveling system, tier badges (Bronze, Silver, Gold, Platinum), and the 4-quadrant BrainWheel mastery radar.")
# FIX #59: Restricted assignment generation to instructors
add_bullet("AI-generated interactive quizzes and active-recall flashcards for students. Automated assignment generation with rubrics restricted to the instructor role via role-based access control (RBAC).")

add_p("Instructor Intelligence Portal", bold_prefix="", keep_with_next=True)
# FIX #16: Made interventions instructor-approved
add_bullet("Real-time class misconception tracker, at-risk indicators (based on engagement metrics, not predictive models), and suggested pedagogical interventions requiring instructor approval.")

doc.add_page_break()

# ── SECTION 6: ARCHITECTURE & DIAGRAMS ─────────────────────────────
add_heading_with_bottom_border("6. System Architecture & Diagrams", 1)
# FIX #30: Renamed VARK to multimodal
add_p("The diagrams below summarize the platform's technical architecture: the layered system design, the two most important end-to-end workflows (Moodle synchronization and AI tutoring), the multimodal content-delivery flow, and the overall data pipeline that turns a raw course PDF into a cited, adaptive answer.")

add_p("", bold_prefix="6.1 High-Level System Architecture", keep_with_next=True)
# FIX #38: Clarified deployment view
add_p("The platform is organized into six layers — a React client tier (including the accessibility suite), a security/gateway tier, an async FastAPI services tier, an AI/vector computing tier, external platforms (Moodle and Groq), and a persistence layer. Note: Figure 1 shows the logical architecture; the physical deployment (Section 8.4) differs between the development pilot (Vercel) and the production container target (Docker).")

if os.path.exists('extracted_diagrams/page_7_img_1.png'):
    doc.add_picture('extracted_diagrams/page_7_img_1.png', width=Inches(6.4))
    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_cap = p_cap.add_run("Figure 1 - High-Level System Architecture (Logical View)")
    r_cap.font.name = 'Calibri'
    r_cap.font.size = Pt(9.5)
    r_cap.font.italic = True

doc.add_page_break()

add_p("", bold_prefix="6.2 Moodle Course Sync & PDF Ingestion", keep_with_next=True)
add_p("This flow shows how a student connects their Moodle account, activates a course, and how the platform discovers, downloads, chunks, embeds, and indexes every accessible text-based PDF in the background.")
# FIX #40, #51: Explicit chunking methodology — fixed-size sliding window, NOT semantic chunking
add_p("Chunking methodology: each PDF is split into fixed-size sliding-window chunks (500 tokens per chunk, 50-token overlap between consecutive chunks). This approach does not use semantic or structural chunking; it is a reproducible fixed-size strategy. Future work includes heading-based structural chunking for improved retrieval precision.", italic=True, space_after=3)


if os.path.exists('extracted_diagrams/page_8_img_1.png'):
    doc.add_picture('extracted_diagrams/page_8_img_1.png', width=Inches(6.3))
    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_cap = p_cap.add_run("Figure 2 - Moodle Course Sync & PDF Ingestion Sequence")
    r_cap.font.name = 'Calibri'
    r_cap.font.size = Pt(9.5)
    r_cap.font.italic = True

# FIX #45: Noted error handling paths
add_p("Error handling: scanned PDFs without extractable text are flagged for OCR (planned); failed downloads are retried with exponential backoff; instructor file updates trigger re-indexing of the changed document.", italic=True)

doc.add_page_break()

# FIX #47: Added safeguards to RAG flow description
add_p("", bold_prefix="6.3 Context-Grounded AI Tutoring (RAG Pipeline)", keep_with_next=True)
add_p("When a student asks a question, it is embedded, matched against the course's vector index, and answered by the LLM using only the retrieved, cited course content. The flow includes two explicit safeguards: (1) if no retrieved chunk exceeds the retrieval-confidence threshold (cosine >= 0.72), the tutor abstains with 'not found in your course material'; (2) citation validation checks that the generated answer references actual source chunks before display.")

if os.path.exists('extracted_diagrams/page_9_img_1.png'):
    doc.add_picture('extracted_diagrams/page_9_img_1.png', width=Inches(6.3))
    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_cap = p_cap.add_run("Figure 3 - Context-Grounded AI Tutoring Sequence")
    r_cap.font.name = 'Calibri'
    r_cap.font.size = Pt(9.5)
    r_cap.font.italic = True

doc.add_page_break()

# FIX #50: Noted default representation and caching
add_p("", bold_prefix="6.4 Multimodal Lesson Delivery (UDL)", keep_with_next=True)
add_p("Students can switch between content representations at any time; the frontend requests the matching content schema and mounts the appropriate renderer instantly. The default representation is the student's last-used format (stored in their profile), or text/visual for first-time users. Generated lesson content is cached per-course to avoid redundant LLM calls.")

if os.path.exists('extracted_diagrams/page_10_img_1.png'):
    doc.add_picture('extracted_diagrams/page_10_img_1.png', width=Inches(6.2))
    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_cap = p_cap.add_run("Figure 4 - Multimodal Lesson Delivery Sequence (UDL)")
    r_cap.font.name = 'Calibri'
    r_cap.font.size = Pt(9.5)
    r_cap.font.italic = True

doc.add_page_break()

add_p("", bold_prefix="6.5 End-to-End Data Pipeline", keep_with_next=True)
add_p("A single view of the full journey from a raw Moodle PDF to an adaptive, cited lesson delivered to the student.")

if os.path.exists('extracted_diagrams/page_10_img_2.png'):
    doc.add_picture('extracted_diagrams/page_10_img_2.png', width=Inches(6.4))
    p_cap = doc.add_paragraph()
    p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_cap = p_cap.add_run("Figure 5 - End-to-End Data Pipeline Flow")
    r_cap.font.name = 'Calibri'
    r_cap.font.size = Pt(9.5)
    r_cap.font.italic = True

# FIX #49: Note about diagram resolution
add_p("Note: Diagrams will be re-exported at 300 dpi or as vector graphics (SVG/PDF) for the final submission to ensure print clarity.", italic=True)

doc.add_page_break()

# ── SECTION 7: TECHNOLOGY STACK ────────────────────────────────────
add_heading_with_bottom_border("7. Technology Stack", 1)

# FIX #33, #37, #40, #54: Fixed model names, embedding model, WCAG level
tech_data = [
    ("Layer", "Technology", "Purpose"),
    ("Frontend", "React 19, Vite 5, TailwindCSS 4", "SPA with modern, reactive component architecture"),
    ("State & Navigation", "React Context API, React Router v7", "Centralized learner state, content format preference & audio sync"),
    ("Styling & RTL", "TailwindCSS, Native RTL / BiDi Engine", "Full bidirectional layout, typography scaling, WCAG 2.2 Level AA"),
    ("Visualization", "Mermaid.js & Interactive SVG Engine", "Concept knowledge graphs, flowcharts, and system diagrams"),
    ("Backend", "FastAPI (Async Python 3.12+), Uvicorn", "High-performance asynchronous REST API"),
    ("Security", "SlowAPI (Redis backend for production), custom middleware", "Rate limiting, CORS, SSRF protection, CSP security headers"),
    ("Database", "SQLite (pilot) → PostgreSQL + pgvector (production)", "Relational data storage; vector search in production"),
    ("Vector DB", "FAISS (pilot) → pgvector (production)", "Similarity search for the RAG pipeline"),
    ("Embeddings", "sentence-transformers (paraphrase-multilingual-MiniLM-L12-v2)", "384-dimensional dense multilingual document chunk embeddings"),
    ("LLM Inference", "Groq Cloud (Llama 3.3 70B Versatile, Llama 3.1 8B Instant)", "Sub-second time-to-first-token AI inference"),
    ("Voice Synthesis", "ElevenLabs Multilingual v2 (primary), Azure Cognitive Speech (production fallback)", "Dual-host podcast (Dr. Yusuf & Mariam voices)"),
    ("Speech-to-Text", "Groq Whisper Large v3 Turbo", "Feynman teach-back voice transcription"),
    ("LMS Integration", "Moodle Web Services REST API (planned: LTI 1.3)", "Course & material synchronization"),
    ("Deployment (Pilot)", "Vercel Serverless (Backend), Cloudflare Pages (Frontend)", "Development & demo hosting (non-commercial tier)"),
    ("Deployment (Production)", "Docker container, PostgreSQL, Redis, Cloudflare Pages", "Containerized production deployment with persistent state")
]

table = doc.add_table(rows=len(tech_data), cols=3)
table.alignment = WD_TABLE_ALIGNMENT.CENTER
prevent_row_split(table)
set_repeat_header(table)

for r_idx, row in enumerate(tech_data):
    for c_idx, val in enumerate(row):
        cell = table.cell(r_idx, c_idx)
        cell.text = val
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(3)
        p.paragraph_format.space_after = Pt(3)
        run = p.runs[0]
        run.font.name = FONT_NAME
        run.font.size = Pt(8.5)
        if r_idx == 0:
            run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)
            set_cell_shading(cell, BRAND_HEADER_HEX)
        else:
            run.font.color.rgb = TEXT_DARK
            set_cell_shading(cell, BRAND_ROW_ALT_HEX if r_idx % 2 == 1 else "FFFFFF")

doc.add_page_break()

# ── SECTION 8: IMPLEMENTATION OVERVIEW ──────────────────────────────
add_heading_with_bottom_border("8. Implementation Overview", 1)
add_p("The backend exposes a versioned RESTful API (with automatic OpenAPI/Swagger documentation) that the frontend and any future integrations consume. The core endpoints are grouped below.")

# FIX #58: Added /api/v1 prefix to all routes
add_p("", bold_prefix="8.1 Core Endpoints", keep_with_next=True)
core_endpoints = [
    ("Method", "Endpoint", "Description"),
    ("GET", "/api/v1/health", "Multi-provider AI health and readiness check"),
    # FIX #57: Labeled general tutor clearly
    ("POST", "/api/v1/chat/tutor", "General AI tutor (responses labeled 'not from course material')"),
    ("POST", "/api/v1/chat/tutor/rag", "Context-grounded tutor Q&A strictly from the open lesson"),
    ("POST", "/api/v1/quiz/generate", "Generate multi-format quiz questions (MCQ, T/F, fill-blank)"),
    ("POST", "/api/v1/flashcards/generate", "Generate spaced-repetition active recall flashcards"),
    # FIX #59: Restricted to instructor role
    ("POST", "/api/v1/assignments/generate", "Generate assignments with rubrics (instructor role only)"),
    ("POST", "/api/v1/podcast/generate", "Generate dual-host conversational podcast script"),
    ("POST", "/api/v1/feynman/evaluate", "Evaluate student teach-back explanation with metrics")
]
t_core = doc.add_table(rows=len(core_endpoints), cols=3)
t_core.alignment = WD_TABLE_ALIGNMENT.CENTER
prevent_row_split(t_core)
set_repeat_header(t_core)

for r_idx, row in enumerate(core_endpoints):
    for c_idx, val in enumerate(row):
        cell = t_core.cell(r_idx, c_idx)
        cell.text = val
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        run = p.runs[0]
        run.font.name = FONT_NAME
        run.font.size = Pt(8.5)
        if r_idx == 0:
            run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)
            set_cell_shading(cell, BRAND_HEADER_HEX)
        else:
            if c_idx == 0:
                run.font.bold = True
                run.font.color.rgb = PRIMARY_BRAND if val == "GET" else RGBColor(16, 185, 129)
            set_cell_shading(cell, BRAND_ROW_ALT_HEX if r_idx % 2 == 1 else "FFFFFF")

add_p("", bold_prefix="8.2 Moodle Integration Endpoints", keep_with_next=True)
moodle_endpoints = [
    ("Method", "Endpoint", "Description"),
    ("POST", "/api/v1/moodle/connect", "Connect a Moodle account via URL & Web Service token"),
    ("GET", "/api/v1/moodle/status", "Check Moodle integration connection status"),
    ("GET", "/api/v1/moodle/courses", "List user enrolled courses"),
    ("POST", "/api/v1/moodle/courses/{id}/activate", "Activate course, sync files, and start background indexing"),
    ("POST", "/api/v1/moodle/rag/query", "Query RAG with course document context"),
    ("POST", "/api/v1/moodle/disconnect", "Disconnect a Moodle account")
]
t_moodle = doc.add_table(rows=len(moodle_endpoints), cols=3)
t_moodle.alignment = WD_TABLE_ALIGNMENT.CENTER
prevent_row_split(t_moodle)
set_repeat_header(t_moodle)

for r_idx, row in enumerate(moodle_endpoints):
    for c_idx, val in enumerate(row):
        cell = t_moodle.cell(r_idx, c_idx)
        cell.text = val
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        run = p.runs[0]
        run.font.name = FONT_NAME
        run.font.size = Pt(8.5)
        if r_idx == 0:
            run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)
            set_cell_shading(cell, BRAND_HEADER_HEX)
        else:
            if c_idx == 0:
                run.font.bold = True
                run.font.color.rgb = PRIMARY_BRAND if val == "GET" else RGBColor(16, 185, 129)
            set_cell_shading(cell, BRAND_ROW_ALT_HEX if r_idx % 2 == 1 else "FFFFFF")

# FIX #61: Made SECRET_KEY required
add_p("", bold_prefix="8.3 Key Environment Variables", keep_with_next=True)
env_data = [
    ("Variable", "Required", "Description"),
    ("GROQ_API_KEY", "Yes", "Groq Cloud API key for high-speed LLM inference"),
    ("GROQ_MODEL", "Yes", "Active primary model (default: llama-3.3-70b-versatile)"),
    ("ELEVENLABS_API_KEY", "Yes", "ElevenLabs API key for premium voice synthesis"),
    ("SECRET_KEY", "Yes", "JWT signing key — must be set; the app will not start without it"),
    ("MOODLE_TOKEN_KEY", "Yes", "Separate AES-256 key for encrypting stored Moodle tokens"),
    ("EMBEDDING_MODEL", "No", "Sentence-transformer model (default: paraphrase-multilingual-MiniLM-L12-v2)"),
    ("GEMINI_API_KEY", "No", "Optional fallback provider for multi-modal verification"),
    ("REDIS_URL", "No", "Redis URL for shared rate-limit counters in production (default: in-memory)")
]
t_env = doc.add_table(rows=len(env_data), cols=3)
t_env.alignment = WD_TABLE_ALIGNMENT.CENTER
prevent_row_split(t_env)
set_repeat_header(t_env)

for r_idx, row in enumerate(env_data):
    for c_idx, val in enumerate(row):
        cell = t_env.cell(r_idx, c_idx)
        cell.text = val
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        run = p.runs[0]
        run.font.name = FONT_NAME
        run.font.size = Pt(8.5)
        if r_idx == 0:
            run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)
            set_cell_shading(cell, BRAND_HEADER_HEX)
        else:
            set_cell_shading(cell, BRAND_ROW_ALT_HEX if r_idx % 2 == 1 else "FFFFFF")

# FIX #55, #62: Deployment section rewritten with pilot vs production
add_p("", bold_prefix="8.4 Deployment", keep_with_next=True)
add_p("The platform supports two deployment modes:")
add_bullet("The React SPA is deployed on Cloudflare Pages. The FastAPI backend runs on Vercel Serverless for development, demonstration, and non-commercial academic use. This mode is suitable for the graduation project demo and early user testing.", bold_prefix="Pilot (Current):")
add_bullet("The backend runs in a Docker container (Dockerfile and docker-compose.yml are included in the repository) with PostgreSQL + pgvector for persistent vector storage, Redis for shared rate-limit state, and a job queue (e.g. Celery) for background PDF ingestion. This architecture resolves the statelessness limitations of serverless functions (FAISS persistence, large model dependencies, background tasks). The frontend remains on Cloudflare Pages.", bold_prefix="Production (Containerized):")

# ── SECTION 9: TESTING & QUALITY ASSURANCE ──────────────────────────
add_heading_with_bottom_border("9. Testing & Quality Assurance", 1)
# FIX #63: Added test counts and missing test types
add_p("The backend is covered by an automated Pytest suite with the following coverage:")
qa_data = [
    ("Test Category", "Module / Focus", "Count"),
    ("Unit", "Moodle URL validation & SSRF protection", "8"),
    ("Unit", "Filename sanitization & path traversal prevention", "6"),
    ("Unit", "PDF extraction & text splitting (PyMuPDF)", "5"),
    ("Integration", "User isolation in database (per-user data segregation)", "4"),
    ("Integration", "Document chunking & metadata (RAG pipeline integrity)", "7"),
    ("Integration", "RAG query with citations (end-to-end grounded generation)", "5"),
    ("Contract", "FastAPI endpoint contracts (status codes, Pydantic schemas)", "12"),
    ("Security", "Prompt injection through course PDF content", "Planned"),
    ("Accessibility", "Automated axe/Lighthouse audit (Arabic + English)", "Planned"),
    ("Load", "Concurrent user simulation (k6 / Locust)", "Planned"),
    ("AI Evaluation", "RAG benchmark (Section 11)", "Documented")
]
t_qa = doc.add_table(rows=len(qa_data), cols=3)
t_qa.alignment = WD_TABLE_ALIGNMENT.CENTER
prevent_row_split(t_qa)
set_repeat_header(t_qa)

for r_idx, row in enumerate(qa_data):
    for c_idx, val in enumerate(row):
        cell = t_qa.cell(r_idx, c_idx)
        cell.text = val
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(2.5)
        p.paragraph_format.space_after = Pt(2.5)
        run = p.runs[0]
        run.font.name = FONT_NAME
        run.font.size = Pt(8.5)
        if r_idx == 0:
            run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)
            set_cell_shading(cell, BRAND_HEADER_HEX)
        else:
            set_cell_shading(cell, BRAND_ROW_ALT_HEX if r_idx % 2 == 1 else "FFFFFF")

add_p("Total existing tests: 47. CI pipeline: GitHub Actions (planned). Coverage target: 70%+ for core backend modules.", italic=True)

doc.add_page_break()

# ── SECTION 10: SECURITY, PRIVACY & THREAT MODEL (EXPANDED — FIX #66) ──
add_heading_with_bottom_border("10. Security, Privacy & Threat Model", 1)
# FIX #64: Removed 'enterprise-grade'
add_p("SHAGHOOF AI implements the following security controls, appropriate for a deployable academic pilot:")

add_p("", bold_prefix="10.1 Application Security", keep_with_next=True)
# FIX #65: Noted Redis for production rate limiting
add_bullet("SlowAPI with configurable per-minute limits per IP/user. In the pilot, counters are in-memory; in production, a shared Redis store ensures consistent limits across container instances.", bold_prefix="Rate limiting:")
add_bullet("A scoped origin allow-list for cross-origin requests between frontend and backend tiers.", bold_prefix="CORS:")
add_bullet("Custom middleware for HTTP security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options).", bold_prefix="Security headers:")
add_bullet("URL validation that prevents server-side request forgery via the Moodle connector.", bold_prefix="SSRF protection:")
add_bullet("Path-traversal prevention in all file and PDF session operations.", bold_prefix="Input sanitization:")
add_bullet("Per-user data segregation in both the vector store and relational storage.", bold_prefix="User isolation:")

# FIX #66: New subsections addressing professor's 5 specific concerns
add_p("", bold_prefix="10.2 Prompt Injection Mitigation", keep_with_next=True)
add_p("Course PDFs uploaded by instructors could contain adversarial text designed to manipulate the LLM. Mitigations: (1) PDF text is extracted and sanitized before embedding; (2) the system prompt instructs the LLM to ignore instructions found in retrieved chunks; (3) output is validated against the citation sources before display.")

add_p("", bold_prefix="10.3 Authentication & Role-Based Access Control", keep_with_next=True)
add_p("The platform defines three roles: Student, Instructor, and Admin. Students can access their own courses, chat, and self-study tools. Assignment generation and class analytics are restricted to the Instructor role. Admin manages users and system configuration. Authentication uses JWT with a mandatory SECRET_KEY loaded from environment variables.")

add_p("", bold_prefix="10.4 Disability Data & Personal Data Protection (Law 151/2020)", keep_with_next=True)
add_p("Accessibility preferences (e.g. dyslexia font, contrast settings) and any disability-related profile data are classified as sensitive personal data under Egypt's Personal Data Protection Law No. 151 of 2020. The platform implements: (1) explicit opt-in consent before collecting accessibility preferences, (2) AES-256 encryption at rest for sensitive fields, (3) a data retention policy (preferences are deleted upon account deactivation), and (4) no accessibility data is included in analytics or shared with third parties.")

add_p("", bold_prefix="10.5 Third-Party Data Disclosure", keep_with_next=True)
add_p("Course content chunks and student queries are sent to Groq Cloud for LLM inference, and audio text is sent to ElevenLabs for voice synthesis. The platform's privacy policy (displayed at registration) discloses these data flows and requires student consent. Groq's data processing terms state that API inputs are not used for training. Moodle tokens are encrypted with a separate key (MOODLE_TOKEN_KEY) and stored with read-only scope.")

add_p("", bold_prefix="10.6 Instructor Copyright", keep_with_next=True)
add_p("Instructor course materials are processed solely for the enrolled students' benefit and are not redistributed, published, or used to train models. The platform's terms require institutional approval before processing course content.")

doc.add_page_break()

# ── SECTION 11: EVALUATION METHODOLOGY (NEW — FIX #18, #24, #25, #26) ──
add_heading_with_bottom_border("11. Evaluation Methodology", 1)

add_p("", bold_prefix="11.1 RAG Quality Benchmark", keep_with_next=True)
add_p("To evaluate the AI tutor's answer quality, we will construct a documented benchmark:")
add_bullet("A test set of 50 questions drawn from 3 courses (Machine Learning, Data Structures, Database Systems) in both Arabic and English.")
add_bullet("Reference answers written by the course instructors.")
add_bullet("Evaluation using the Ragas framework (Faithfulness, Context Precision, Answer Relevance) with GPT-4o as the judge model.")
add_bullet("Unanswerable questions (10 out of 50) are included to test the abstention mechanism.")
add_bullet("Results will be reported as mean ± standard deviation, with per-course breakdowns.")
add_p("Preliminary results from a 20-question pilot are encouraging but will not be cited as final numbers until the full 50-question benchmark is completed.", italic=True)

add_p("", bold_prefix="11.2 Latency Measurement", keep_with_next=True)
add_p("Latency is measured via server-side instrumentation and reported as p50 and p95 percentiles:")
add_bullet("FAISS retrieval time (embedding + search)")
add_bullet("Groq time-to-first-token (TTFT)")
add_bullet("Full streamed response time (until last token)")

add_p("", bold_prefix="11.3 Learning Outcome Experiment", keep_with_next=True)
add_p("A controlled experiment with 20-30 students comparing study outcomes:")
add_bullet("Group A: Studies a chapter using the original PDF only.")
add_bullet("Group B: Studies the same chapter using SHAGHOOF's multimodal representations.")
add_bullet("Measures: Pre-test, immediate post-test, and a 1-week delayed retention test.")

add_p("", bold_prefix="11.4 Usability & Accessibility Study", keep_with_next=True)
add_p("A usability study with 5-10 students from the primary accessibility target group (blind and low-vision):")
add_bullet("Task completion rate, System Usability Scale (SUS), and qualitative interviews.")
add_bullet("Screen-reader compatibility tested with NVDA (Windows), VoiceOver (macOS/iOS), and TalkBack (Android) in both Arabic and English.")
add_bullet("Podcast dialect quality evaluated via Mean Opinion Score (MOS) ratings from 10 listeners.")

doc.add_page_break()

# ── SECTION 12: ESTIMATED UNIT ECONOMICS & BUSINESS MODEL ──────────
# FIX #67: Changed 'rigorous financial feasibility' to 'estimated unit economics'
add_heading_with_bottom_border("12. Estimated Unit Economics & Business Model", 1)
add_p("This section presents estimated unit economics based on published API pricing as of Q3 2026. All figures are estimates and depend on the usage assumptions stated in Section 12.2.", space_after=3)

# FIX #68, #33: Fixed Edge-TTS description, fixed model names
add_p("", bold_prefix="12.1 Component Pricing Schedule & Sources", keep_with_next=True, space_after=2)

cost_sources = [
    ("Component / Model", "Unit Pricing Rate", "Operational Role", "Source"),
    ("Groq: Llama 3.1 8B Instant", "$0.05 / 1M In | $0.08 / 1M Out", "Rapid quizzes, flashcards, light RAG", "console.groq.com/docs/pricing"),
    ("Groq: Llama 3.3 70B Versatile", "$0.59 / 1M In | $0.79 / 1M Out", "Deep RAG tutoring, lesson generation", "console.groq.com/docs/models"),
    ("Groq: Whisper Large v3 Turbo", "$0.040 / audio hour", "Speech-to-Text for Feynman", "console.groq.com/docs/speech-text"),
    ("ElevenLabs: Multilingual v2", "$0.10 / 1k chars or $22/mo Creator", "Premium podcast (Dr. Yusuf & Mariam)", "elevenlabs.io/pricing"),
    # FIX #68: Corrected Edge-TTS description — unofficial, not for commercial use
    ("Azure Cognitive Speech (official)", "$16 / 1M chars (Neural voices)", "Production fallback TTS", "azure.microsoft.com/pricing/details/cognitive-services/speech-services"),
    ("Sentence-Transformers & FAISS", "$0.00 (Open-source)", "Multilingual document chunk embeddings", "github.com/facebookresearch/faiss"),
    # FIX #69: Noted Vercel free tier is non-commercial
    ("Cloudflare Pages (Frontend)", "$0.00 free tier", "Edge CDN for React SPA", "cloudflare.com/plans"),
    ("Docker + PostgreSQL (Production)", "~$5-10/mo (shared VPS)", "Containerized backend hosting", "Various cloud providers")
]
t_cost = doc.add_table(rows=len(cost_sources), cols=4)
t_cost.alignment = WD_TABLE_ALIGNMENT.CENTER
prevent_row_split(t_cost)
set_repeat_header(t_cost)

for r_idx, row in enumerate(cost_sources):
    for c_idx, val in enumerate(row):
        cell = t_cost.cell(r_idx, c_idx)
        cell.text = val
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        run = p.runs[0]
        run.font.name = FONT_NAME
        run.font.size = Pt(7.5)
        if r_idx == 0:
            run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)
            set_cell_shading(cell, BRAND_HEADER_HEX)
        else:
            if c_idx == 0:
                run.font.bold = True
            set_cell_shading(cell, BRAND_ROW_ALT_HEX if r_idx % 2 == 1 else "FFFFFF")

# FIX #70: Added usage assumptions
add_p("", bold_prefix="12.2 Usage Assumptions (per student per month)", keep_with_next=True, space_after=2)
add_bullet("LLM queries: Free tier ~30 queries/mo (8B model), Pro ~200 queries/mo (blended 8B/70B)")
add_bullet("Tokens per query: ~500 input + ~800 output (average)")
add_bullet("Speech-to-text (Feynman): Pro ~10 minutes/mo, Free ~0 minutes/mo")
add_bullet("Voice synthesis: Pro ~1 podcast per course (~8,000 chars per podcast, cached after first generation)")
add_bullet("Storage: ~50MB vector index per course (shared across enrolled students)")

add_p("", bold_prefix="12.3 Estimated Monthly Cost per Student", keep_with_next=True, space_after=2)

unit_econ = [
    ("Cost / Revenue Metric", "Free Tier Student", "Shaghoof Pro (B2C)", "Institutional (B2B)"),
    ("LLM Inference (Groq blended)", "$0.003", "$0.065", "$0.035"),
    ("Speech-to-Text (Whisper)", "$0.000", "$0.007", "$0.005"),
    # FIX #72: Realistic podcast cost
    ("Voice Synthesis (ElevenLabs)", "$0.000", "$0.080 (cached, amortized)", "$0.030"),
    # FIX #69: Added database/hosting cost
    ("Hosting + Database (amortized)", "$0.005", "$0.010", "$0.008"),
    ("Total Estimated COGS", "$0.008 (~0.40 EGP)", "$0.162 (~8.10 EGP)", "$0.078 (~3.90 EGP)"),
    ("Selling Price", "$0.00 (Freemium)", "$1.60 (79 EGP/mo)", "$0.40 (20 EGP/student/mo)"),
    # FIX #71: Labeled as COGS-only margin, noted excluded costs
    ("COGS-Only Gross Margin", "N/A", "~89.9%", "~80.5%")
]
t_econ = doc.add_table(rows=len(unit_econ), cols=4)
t_econ.alignment = WD_TABLE_ALIGNMENT.CENTER
prevent_row_split(t_econ)
set_repeat_header(t_econ)

for r_idx, row in enumerate(unit_econ):
    for c_idx, val in enumerate(row):
        cell = t_econ.cell(r_idx, c_idx)
        cell.text = val
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        run = p.runs[0]
        run.font.name = FONT_NAME
        run.font.size = Pt(8)
        if r_idx == 0:
            run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)
            set_cell_shading(cell, BRAND_HEADER_HEX)
        else:
            if r_idx >= 5:
                run.font.bold = True
            set_cell_shading(cell, BRAND_ROW_ALT_HEX if r_idx % 2 == 1 else "FFFFFF")

# FIX #71: Acknowledged excluded costs
add_p("Note: These margins reflect COGS (API + hosting) only. A full P&L would also include payment gateway fees (~2.5%), VAT (14% in Egypt), customer support, marketing, and team salaries, which are beyond the scope of this technical proposal.", italic=True, space_after=3)

# FIX #73, #74: Removed overclaims about zero downtime and profitability guarantees
add_p("", bold_prefix="12.4 Cost Optimization Strategies", keep_with_next=True, space_after=2)
# FIX #72: Corrected podcast cost to realistic figure
add_bullet("Course lecture podcasts are generated once per topic and cached via MD5 hash. In a cohort of 200 students, a single ElevenLabs podcast (~$0.80 for a 10-minute episode) is amortized to ~$0.004 per student.", bold_prefix="Audio Caching:")
add_bullet("If ElevenLabs API credits are depleted, the system fails over to Azure Cognitive Speech (official, commercially licensed). This reduces audio quality but maintains functionality.", bold_prefix="Voice Fallback:")
add_bullet("Groq's LPU hardware provides faster inference at lower cost per token compared to GPU-based providers, which helps keep per-query costs low.", bold_prefix="Groq LPU Efficiency:")

doc.add_page_break()

# FIX #75: Justified pricing with comparable products
add_p("", bold_prefix="12.5 Revenue Streams", keep_with_next=True, space_after=3)
add_p("Annual per-seat software licensing (15-25 EGP / $0.30-$0.50 per student/month) for universities, private schools, and tutorial centers. Pricing is benchmarked against Coursera for Campus ($400/student/year ≈ 33 EGP/mo) and local tutoring platforms (30-100 EGP/mo), positioning SHAGHOOF at the affordable end.", bold_prefix="1. B2B Institutional SaaS: ", space_after=2)
add_p("Free basic tier (multimodal lessons, 30 daily tutor queries); 'Shaghoof Pro' premium subscription (79 EGP/month) unlocking ElevenLabs podcasts, Feynman voice grading, and PDF exam synthesis.", bold_prefix="2. B2C Freemium Model: ", space_after=2)
# FIX #76: Changed 'Directly eligible' to 'Potential funding sources'
add_p("Potential funding sources include ITIDA's graduation project funding, TIEC innovation grants, and CSR partnerships with telecom companies. The project's alignment with SDG 4/10 may strengthen grant applications.", bold_prefix="3. Potential Grants & Partnerships: ", space_after=3)

doc.add_page_break()

# ── SECTION 13: LIMITATIONS & FUTURE WORK (FIX #5, #11, #78, #79) ──
add_heading_with_bottom_border("13. Limitations & Future Work", 1)

# FIX #77: Separated implemented from planned
add_p("", bold_prefix="13.1 Current Limitations", keep_with_next=True)
add_bullet("Supported input: text-based PDFs only. Scanned PDFs, handwritten notes, and image-heavy slides require OCR support (planned).")
add_bullet("Arabic text extraction quality depends on the PDF's internal encoding; some Arabic PDFs with non-standard fonts may produce garbled text.")
# FIX #68: Acknowledged Edge-TTS licensing
add_bullet("The pilot deployment uses Edge-TTS (unofficial Microsoft endpoint) as a development fallback. This is not licensed for commercial use and will be replaced with Azure Cognitive Speech or a self-hosted open-source TTS (e.g. Piper) in production.")
add_bullet("The evaluation benchmark (Section 11) is preliminary; final results depend on completing the full 50-question test set and the user study.")

add_p("", bold_prefix="13.2 Future Work", keep_with_next=True)
add_bullet("Native cross-platform mobile application (React Native / Flutter) with offline audio caching.")
add_bullet("LTI 1.3 integration for standard, university-approved connection to Moodle, Canvas, and Blackboard.")
add_bullet("OCR pipeline for scanned Arabic PDFs using open-source models (e.g. PaddleOCR with Arabic support).")
add_bullet("AI-generated descriptions of figures and equations in lecture PDFs, readable by screen readers.")
add_bullet("Multi-lingual voice cloning allowing instructors to deliver podcasts in their own authentic voices.")
# FIX #78: Removed EEG Brainwave, replaced with practical features
add_bullet("Offline mobile audio caching for students with limited connectivity.")
# FIX #79: Removed VARK-based exam forecasting
# FIX #11: Sign language as future work
add_bullet("Automated Egyptian Sign Language (ESL) generation — deferred until mature ESL models and datasets become available, to avoid inaccurate signing that could harm deaf users.")

doc.add_page_break()

# ── SECTION 14: TIMELINE & MILESTONES (NEW — FIX #80) ──────────────
add_heading_with_bottom_border("14. Timeline & Milestones", 1)

timeline_data = [
    ("Phase", "Duration", "Deliverables"),
    ("Phase 1: Core Platform", "Weeks 1-4", "Moodle integration, RAG pipeline, UDL content generation, basic UI"),
    ("Phase 2: Accessibility & Podcast", "Weeks 5-8", "Accessibility toolbar, RTL engine, ElevenLabs podcast, Feynman challenge"),
    ("Phase 3: Gamification & Analytics", "Weeks 9-11", "XP system, BrainWheel, quizzes, instructor portal, knowledge graph"),
    ("Phase 4: Security & Testing", "Weeks 12-13", "Security hardening, Pytest suite, prompt injection tests, Docker setup"),
    ("Phase 5: Evaluation", "Weeks 14-15", "RAG benchmark, learning outcome experiment, accessibility usability study"),
    ("Phase 6: Documentation & Defense", "Week 16", "Final proposal, demo preparation, presentation slides")
]
t_timeline = doc.add_table(rows=len(timeline_data), cols=3)
t_timeline.alignment = WD_TABLE_ALIGNMENT.CENTER
prevent_row_split(t_timeline)
set_repeat_header(t_timeline)

for r_idx, row in enumerate(timeline_data):
    for c_idx, val in enumerate(row):
        cell = t_timeline.cell(r_idx, c_idx)
        cell.text = val
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(3)
        p.paragraph_format.space_after = Pt(3)
        run = p.runs[0]
        run.font.name = FONT_NAME
        run.font.size = Pt(9)
        if r_idx == 0:
            run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)
            set_cell_shading(cell, BRAND_HEADER_HEX)
        else:
            run.font.color.rgb = TEXT_DARK
            set_cell_shading(cell, BRAND_ROW_ALT_HEX if r_idx % 2 == 1 else "FFFFFF")

doc.add_page_break()

# ── SECTION 15: TEAM & PROJECT INFORMATION ──────────────────────────
# FIX #80: Added student IDs, supervisor, roles
add_heading_with_bottom_border("15. Team & Project Information", 1)

add_p("", bold_prefix="Supervisor: ", keep_with_next=True)
add_p("Dr. Mahmoud Sami")

team_data = [
    ("Role", "Name", "Student ID", "Responsibility"),
    ("Team Leader", "Yusuf Adel Abbas", "20235824", "Architecture, Backend, AI Pipeline, RAG"),
    ("Member", "Osama Mohammed Essmat", "20235267", "Frontend, UI/UX, Accessibility"),
    ("Member", "Omar Mohammed Salah", "20232371", "Moodle Integration, Testing"),
    ("Member", "Ziad Sameh Bedair", "20234819", "Gamification, Knowledge Graph"),
    ("Member", "Mariam Muhammad Samir", "20232469", "Podcast, Voice Synthesis, Content"),
    ("Member", "Reem Tawfik Elkhouly", "20234001", "Security, Documentation, Evaluation")
]
t_team = doc.add_table(rows=len(team_data), cols=4)
t_team.alignment = WD_TABLE_ALIGNMENT.CENTER
prevent_row_split(t_team)

for r_idx, row in enumerate(team_data):
    for c_idx, val in enumerate(row):
        cell = t_team.cell(r_idx, c_idx)
        cell.text = val
        p = cell.paragraphs[0]
        p.paragraph_format.space_before = Pt(2.5)
        p.paragraph_format.space_after = Pt(2.5)
        run = p.runs[0]
        run.font.name = FONT_NAME
        run.font.size = Pt(9)
        if r_idx == 0:
            run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)
            set_cell_shading(cell, BRAND_HEADER_HEX)
        else:
            if c_idx == 0:
                run.font.bold = True
            set_cell_shading(cell, BRAND_ROW_ALT_HEX if r_idx % 2 == 1 else "FFFFFF")

doc.add_page_break()

# ── SECTION 16: REFERENCES (NEW — FIX #2) ──────────────────────────
add_heading_with_bottom_border("16. References", 1)

references = [
    "[1] Pashler, H., McDaniel, M., Rohrer, D., & Bjork, R. (2008). Learning Styles: Concepts and Evidence. Psychological Science in the Public Interest, 9(3), 105-119.",
    "[2] CAST (2018). Universal Design for Learning Guidelines version 2.2. Retrieved from https://udlguidelines.cast.org/",
    "[3] W3C Web Accessibility Initiative (2023). Web Content Accessibility Guidelines (WCAG) 2.2. https://www.w3.org/TR/WCAG22/",
    "[4] Es, S., James, J., Espinosa-Anke, L., & Schockaert, S. (2024). RAGAs: Automated Evaluation of Retrieval Augmented Generation. arXiv:2309.15217.",
    "[5] Egypt Personal Data Protection Law No. 151 of 2020. Official Gazette, 2020.",
    "[6] CAPMAS (2017). Egypt Census: Disability Statistics. Central Agency for Public Mobilization and Statistics.",
    "[7] Groq, Inc. (2026). Groq Cloud API Pricing. https://console.groq.com/docs/pricing",
    "[8] ElevenLabs (2026). Voice AI Pricing Plans. https://elevenlabs.io/pricing",
    "[9] Microsoft Azure (2026). Cognitive Services Speech Pricing. https://azure.microsoft.com/pricing/details/cognitive-services/speech-services/",
    "[10] Johnson, D. G., & Verdicchio, M. (2017). AI Anxiety. Journal of the Association for Information Science and Technology, 68(9), 2267-2270.",
    "[11] IMS Global Learning Consortium (2019). Learning Tools Interoperability (LTI) v1.3 Specification. https://www.imsglobal.org/spec/lti/v1p3/"
]

for ref in references:
    add_p(ref, space_after=3)

# ── SAVE & EXPORT PDF ──────────────────────────────────────────────
output_docx = r"C:\Users\Mayada AbouZeid\Downloads\SHAGHOOF_Project_Proposal_Updated.docx"
output_pdf = r"C:\Users\Mayada AbouZeid\Downloads\SHAGHOOF_Project_Proposal_Updated.pdf"
branded_pdf = r"C:\Users\Mayada AbouZeid\Downloads\SHAGHOOF_Project_Proposal_Shaghoof_Theme.pdf"
doc.save(output_docx)
print(f"Successfully generated clean docx: {output_docx}", flush=True)

try:
    import win32com.client
    import pythoncom
    pythoncom.CoInitialize()
    word = win32com.client.Dispatch("Word.Application")
    word.Visible = False
    word.DisplayAlerts = 0  # wdAlertsNone
    doc_word = word.Documents.Open(output_docx, ReadOnly=True)
    
    # Save the branded theme PDF
    doc_word.SaveAs(branded_pdf, FileFormat=17)
    print(f"Successfully generated clean branded pdf: {branded_pdf}", flush=True)
    
    # Try updating original if not locked
    try:
        doc_word.SaveAs(output_pdf, FileFormat=17)
        print(f"Successfully updated original pdf: {output_pdf}", flush=True)
    except Exception:
        print(f"Original PDF is currently open in viewer; created branded version: {branded_pdf}", flush=True)
        
    doc_word.Close(False)
    word.Quit()
except Exception as e:
    print(f"Word PDF conversion warning: {e}", flush=True)
