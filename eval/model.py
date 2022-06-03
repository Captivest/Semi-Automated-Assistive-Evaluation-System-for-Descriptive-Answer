from transformers import pipeline
from sentence_transformers import SentenceTransformer, util
import numpy as np
import language_tool_python
from keybert import KeyBERT
#from semantic_text_similarity.models import WebBertSimilaritys

my_tool = language_tool_python.LanguageTool('en-US')
kw_model = KeyBERT()
#web_model = WebBertSimilarity(device='cpu', batch_size=10)
def evaluate(model_answer, student_answer, semantic_per, length_per, grammar_per, keyword_per, ignr, marks, leng):
  marks = marks

  #SUMMARIZATION
  summarization=pipeline("summarization")
  model_summary = summarization(model_answer)[0]["summary_text"] 
  student_summary = summarization(student_answer)[0]["summary_text"]

  #1 SEMANTIC SIMILARITY
  model = SentenceTransformer('stsb-roberta-large')
  embedding1 = model.encode(model_summary, convert_to_tensor=True)
  embedding2 = model.encode(student_summary, convert_to_tensor=True)
  # compute similarity scores of two embeddings
  cosine_scores = util.pytorch_cos_sim(embedding1, embedding2)
  print("Similarity score:", cosine_scores.item())
  scr=cosine_scores.item()
  if scr<0.4:
    spntr=0
  elif scr<0.7:
    spntr=0.4
  elif scr<0.8:
    spntr=0.6
  else:
    spntr=1

  s=semantic_per*marks*spntr

  #2 LENGTH OF THE ANSWER
  m=student_answer.split()
  if len(m)>=leng:
    lpntr=1
  elif len(m) > leng-20:
    lpntr = 0.5
  else:
    lpntr=0
  l = length_per*marks*lpntr #calculate length score

  #3 GRAMMAR CHECK 
  my_matches = my_tool.check(student_answer)  #getting the matches 
  print(my_matches)
  o=len(my_matches)-ignr
  if o>4:
    gpntr=0
  elif o>3:
    gpntr=0.25
  elif o>2:
    gpntr=0.5
  elif o>1:
    gpntr=0.75
  else:
    gpntr=1
  g = marks*grammar_per*gpntr #calculating grammar score

  #4 KEYWORD MATCHING
  keywords1 = kw_model.extract_keywords(model_summary)
  keywords2 = kw_model.extract_keywords(student_summary)
  v=[]
  d=[]
  for i in keywords1:
    v.append(i[0])
  for j in keywords2:
    d.append(j[0])
  kk=list(set(v) & set(d))
  kk
  cnt=len(kk)
  chk=len(keywords1)
  kpntr=cnt/chk
  k = kpntr*marks*keyword_per #calculating keyword matching score


  print(s)
  print(l)
  print(g)
  print(kk)
  print(v)
  print(d)
  print(k)
  final_score = s + l + g + k
  return final_score

model_answer = """The two testes are oval organs which are contained in a thin-walled sac of skin called the scrotum.
In the embryonic stage, the testes are contained within the abdomen. They descend into the scrotum shortly before birth, an abnormal condition results when they do not descend and it leads to sterility i.e., incapable of produce sperms.
Sperms are produced in the testes at a temperature 2oC to 3oC lower than that of the body. This temperature is regulated in a strange manner through the movements of the scrotum wall.
When it is too hot, the skin of the scrotum loosens so that the testes hang down away from the body. When it is cold, the skin contracts in a folded manner and draws the testes closer to the body for warmth.
"""
student_answer = """The two testes are oval organs which are contained in a thin-walled sac of skin called the scrotum.
In the embryonic stage, the testes are contained within the abdomen. They descend into the scrotum shortly before birth, an abnormal condition results when they do not descend and it leads to sterility i.e., incapable of produce sperms.
Sperms are produced in the testes at a temperature 2oC to 3oC lower than that of the body. This temperature is regulated in a strange manner through the movements of the scrotum wall.
When it is too hot, the skin of the scrotum loosens so that the testes hang down away from the body. When it is cold, the skin contracts in a folded manner and draws the testes closer to the body for warmth.
"""
#evaluate(model_answer, student_answer, 0.5, 0.1, 0.2, 0.2, 2, 10, 10)  
