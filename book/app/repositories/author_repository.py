from app import db
from app.models.author import Author

class AuthorRepository:
    
    @staticmethod
    def get_all_authors():
        return Author.query.all()

    @staticmethod
    def get_author_by_id(author_id):
        return Author.query.get(author_id)

    @staticmethod
    def create_author(author_name):
        try:
            new_author = Author(author_name=author_name)
            db.session.add(new_author)
            db.session.commit()
            return new_author
        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def update_author(author_id, author_name):
        try:
            author = Author.query.get(author_id)
            if author:
                author.author_name = author_name
                db.session.commit()
            return author
        except Exception as e:
            db.session.rollback()
            raise e

    @staticmethod
    def delete_author(author_id):
        try:
            author = Author.query.get(author_id)
            if author:
                db.session.delete(author)
                db.session.commit()
            return author
        except Exception as e:
            db.session.rollback()
            raise e