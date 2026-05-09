import asyncio
from app.db.session import engine
from app.db.base import Base
from app.models.user import User


async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Tables created successfully")
    await engine.dispose()


asyncio.run(create_tables())