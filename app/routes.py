from flask import request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from app import app, db
from app.models import User, Schedule

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='sha256')
    new_user = User(name=data['name'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User registered successfully!'})

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    if user and check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Login successful!', 'user_id': user.id})
    else:
        return jsonify({'message': 'Invalid credentials!'}), 401

@app.route('/submit_schedule', methods=['POST'])
def submit_schedule():
    data = request.get_json()
    user_id = data['user_id']
    for period, class_name in data['schedule'].items():
        new_schedule = Schedule(user_id=user_id, period=int(period), class_name=class_name)
        db.session.add(new_schedule)
    db.session.commit()
    return jsonify({'message': 'Schedule submitted successfully!'})

@app.route('/get_classmates', methods=['POST'])
def get_classmates():
    data = request.get_json()
    user_id = data['user_id']
    schedule = Schedule.query.filter_by(user_id=user_id).all()
    classmates = {}
    for entry in schedule:
        period_classmates = Schedule.query.filter_by(period=entry.period, class_name=entry.class_name).all()
        classmates[entry.period] = [User.query.get(e.user_id).name for e in period_classmates if e.user_id != user_id]
    return jsonify(classmates)