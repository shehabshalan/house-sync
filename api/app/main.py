import uvicorn
from app.config import settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()


@app.get("/healthcheck")
async def healthcheck():
    return {"status": "ok"}


@app.get("/space")
async def get_spaces(arg):
    pass


@app.get("/space/{space_id}")
async def get_space(space_id):
    pass


@app.post("/space")
async def create_space():
    pass


@app.put("/space/{space_id}")
async def update_space(space_id):
    pass


@app.delete("/space/{space_id}")
async def delete_space(space_id):
    pass


@app.get("/space/{space_id}/task")
async def get_space_task(space_id):
    pass


@app.post("/space/{space_id}/task")
async def create_space_task(space_id):
    pass


@app.put("/space/{space_id}/task/{task_id}")
async def update_space_task(space_id):
    pass


@app.delete("/space/{space_id}/task/{task_id}")
async def delete_space_task(space_id):
    pass


@app.get("/space/{space_id}/inventory")
async def get_space_inventory(space_id):
    pass


@app.post("/space/{space_id}/inventory")
async def create_space_inventory(space_id):
    pass


@app.put("/space/{space_id}/inventory/{inventory_id}")
async def update_space_inventory(space_id):
    pass


@app.delete("/space/{space_id}/inventory/{inventory_id}")
async def delete_space_inventory(space_id):
    pass


@app.get("/user/{user_id}")
async def get_user(user_id):
    pass


def main():
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        reload=settings.DEBUG_MODE,
        port=settings.PORT,
        log_config=settings.LOGGING_CONFIG,
    )


if __name__ == "__main__":
    main()
