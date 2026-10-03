from fastapi import APIRouter
from . import assess, stretch, profile, retention, teacher
from . import tutor, quiz_gen, flashcards, assignments, moodle, pdf_chat, lessons, video_lesson, personalization, wordwall_embed, championship

api_router = APIRouter()

# Existing routers
api_router.include_router(assess.router)
api_router.include_router(stretch.router)
api_router.include_router(profile.router)
api_router.include_router(retention.router)
api_router.include_router(teacher.router)

# Routers from SHAGHOOF-AI integration
# Mounted under both root (e.g. /chat/tutor) and /api/v1 (e.g. /api/v1/chat/tutor)
# so frontend calls work seamlessly with any API base configuration.
_additional_routers = [
    tutor.router,
    quiz_gen.router,
    flashcards.router,
    assignments.router,
    moodle.router,
    pdf_chat.router,
    lessons.router,
    video_lesson.router,
    personalization.router,
    championship.router,
]

for r in _additional_routers:
    api_router.include_router(r)
    api_router.include_router(r, prefix="/api/v1")

api_router.include_router(wordwall_embed.router)
