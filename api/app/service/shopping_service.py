from app import schemas
from app.models import ShoppingList
from fastapi import HTTPException, status
from sqlmodel import Session, select


async def get_shopping_list(space_id: int, session: Session, user: schemas.User):
    try:
        shopping_list = session.exec(select(ShoppingList).where(ShoppingList.space_id == space_id)).all()
        return [item.model_dump() for item in shopping_list]
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


async def create_shopping_item(item: schemas.CreateItem, session: Session):
    try:
        new_item = ShoppingList(**item.model_dump())
        session.add(new_item)
        session.commit()
        session.refresh(new_item)
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))


async def update_shopping_item_status(item_id: int, update_item: schemas.UpdateItem, session: Session):
    try:
        item = session.exec(select(ShoppingList).where(ShoppingList.id == item_id)).first()
        if not item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
        item.is_purchased = update_item.is_purchased
        item.purchased_by = update_item.purchased_by
        session.add(item)
        session.commit()
        session.refresh(item)
        return item.model_dump()
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
