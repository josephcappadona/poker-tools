from db import db


class UserModel(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80))
    password = db.Column(db.String(80))
    appearance = db.Column(db.String(80))

    def __init__(self, username, password):
        self.username = username
        self.password = password
        self.appearance = 'light'

    def save_to_db(self):
        db.session.add(self)
        db.session.commit()

    def delete_from_db(self):
        db.session.delete(self)
        db.session.commit()

    def json(self):
        return {
            'username': self.username,
            'password': self.password,
            'appearance': self.appearance,
        }
    
    def get_settings(self):
        return {
            'appearance': self.appearance,
        }

    @classmethod
    def find_by_username(cls, username):
        return cls.query.filter_by(username=username).first()

    @classmethod
    def find_by_id(cls, _id):
        return cls.query.filter_by(id=_id).first()