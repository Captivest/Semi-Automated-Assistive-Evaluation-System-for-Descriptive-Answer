from flask import Flask, request, jsonify,json,redirect,url_for,Response
from flask_cors import CORS
from pymongo import MongoClient
from bson.json_util import dumps, loads
from traitlets import default
import model1
from dotenv import load_dotenv
from os import getenv
load_dotenv()
URI=getenv('URI',None)
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
client=MongoClient(URI)
dbs=client["evaluation"]
t_collection=dbs["teachers"]
s_collection=dbs["students"]
q_collection=dbs["questions"]

    
@app.route('/register',methods=["POST"])
def register():
    data=json.loads(request.data)
    s_schema={"username":data["username"],
            "password":data["password"],
            "name":data["name"],
            "type":data["type"],
            "result":[]
        }
    t_schema={"username":data["username"],
            "password":data["password"],
            "name":data["name"],
            "type":data["type"],
        }
    if int(data["type"])==0:
        if not s_collection.find({"username":data["username"]}):
            return jsonify({"Error":"User already exist"})
        else:
            s_collection.insert_one(s_schema)
            return jsonify({"Success":"Registered Successfully"})    
    elif int(data["type"])==1:
        if not t_collection.find({"username":data["username"]}):
            return jsonify({"Error":"User already exist"})
        else:
            t_collection.insert_one(t_schema)
            return jsonify({"Success":"Registered Successfully"})

@app.route('/login_s',methods=['POST'])
def log():
    if request.method=='POST':
        data=json.loads(request.data)
        print(data)
        user=s_collection.find_one({"username":data["username"]})
        if user:
            if user["username"]==data["username"] and user["password"]==data["password"]:
                return jsonify({"username":user["username"]}) #redirect(url_for("student",user=user["username"],code=307))
        return {}        

@app.route('/login_t',methods=['POST'])
def logt():
    if request.method=='POST':
        data=json.loads(request.data)
        user=t_collection.find_one({"username":data["username"]})
        if user:
            if user["username"]==data["username"] and user["password"]==data["password"]:
                return jsonify({"username":user["username"]}) #redirect(url_for("student",user=user["username"],code=307))
        return {} 

@app.route('/fetchdata_s/<user>')
def fetchdata_s(user):
    data=s_collection.find_one({"username":user})
    print(data)
    return json.dumps(data,default=str)

@app.route('/fetchdata_t/<user>')
def fetchdata_t(user):
    data=t_collection.find_one({"username":user})
    print(data)
    return json.dumps(data,default=str)

@app.route('/fetchdatas')
def fetchall():
    data=s_collection.find({})
    data=dumps(list(data))
    print(data)
    return data

@app.route('/uploadquestion',methods=['POST','GET'])
def upload():
    data=json.loads(request.data)
    q_schema={"qid":data["qid"],
              "m_answer":data["m_answer"],
              "l":float(data["l"]),
              "s":float(data["s"]),
              "g":float(data["g"]),
              "k":float(data["k"]),
              "ignr":float(data["ignr"]),
              "marks":float(data["marks"]),
              "leng":float(data["leng"])}
    q_collection.insert_one(q_schema)
    return jsonify({"Success":"Uploaded Successfully"})

@app.route('/fetchquestion')
def fetchquestion():
    data=q_collection.find({})
    data=dumps(list(data))
    print(data)
    return data  

@app.route('/evaluate',methods=['POST'])
def evaluate():
    data=json.loads(request.data)
    print(data)
    score=model1.run(data["answer"],data["m_answer"],data["s"],data["l"],data["g"],data["k"],data["ignr"],data["marks"],data["leng"])
    print(score)
    r_schema={"qid":data["qid"],
              "answer":data["answer"],
              "m_answer":data["m_answer"],
              "score":score
    }
    return jsonify(r_schema)

@app.route('/insertresult',methods=['POST'])
def insert():
    data=json.loads(request.data)
    user=s_collection.find_one({"username":data["username"]})
    print(user)
    List=user["result"]
    List.append(data["result"])
    s_collection.find_one_and_update({"username":data["username"]},{'$set':{"result":List}})
    return jsonify({"stat":"Inserted"})    