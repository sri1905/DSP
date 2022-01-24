from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

from flask_migrate import Migrate

app = Flask(__name__)
cors =CORS(app)

app.config['JSON_SORT_KEYS'] = False
app.config['SECRET_KEY'] = '1f0cd60a6b15c76009c7f5b8c5eb5259'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
migrate = Migrate(app, db, render_as_batch=True)

# Absolute Path to api 
# ONLY used in populateDB.py

# absolute_path_to_api="/home/ubuntu/schInterface/backend/api"
absolute_path_to_api="/mnt/5b62043e-7fe9-4f5d-a446-8536caeac481/2.IndicWiki/apps/DSP/api/"
# Paths to other folders
pickleFolder =absolute_path_to_api+"picklesFolder/"

#Routes
from api import routes
