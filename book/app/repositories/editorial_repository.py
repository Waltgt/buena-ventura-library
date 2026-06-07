from app import db
from app.models.editorial import Editorial

class EditorialRepository:
    @staticmethod
    def get_all_editorials():
        return Editorial.query.all()

    @staticmethod
    def get_editorial_by_id(editorial_id):
        return Editorial.query.get(editorial_id)

    @staticmethod
    def create_editorial(name_editorial):
        try:
            new_editorial = Editorial(name_editorial=name_editorial)
            db.session.add(new_editorial)
            db.session.commit()
            return new_editorial
        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def update_editorial(editorial_id, name_editorial):
        try:
            editorial = Editorial.query.get(editorial_id)
            if editorial:
                editorial.name_editorial = name_editorial
                db.session.commit()
            return editorial
        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def delete_editorial(editorial_id):
        try:
            editorial = Editorial.query.get(editorial_id)
            if editorial:
                db.session.delete(editorial)
                db.session.commit()
            return editorial
        except Exception as e:
            db.session.rollback()
            raise e