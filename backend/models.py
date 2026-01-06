from extensions import db
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(256), nullable=False)
    name = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime, nullable=True)
    status = db.Column(db.String(20), default='active') # active, suspended, etc.
    last_readiness = db.Column(db.String(20), nullable=True) # READY, CAUTION, OBSERVE
    profile_image = db.Column(db.String(200), nullable=True) # Path to profile image

    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'status': self.status,
            'last_readiness': self.last_readiness,
            'profile_image': self.profile_image
        }
