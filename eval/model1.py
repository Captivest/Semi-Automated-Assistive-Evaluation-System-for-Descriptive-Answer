from transformers import pipeline
from sentence_transformers import SentenceTransformer, util
import numpy as np
import language_tool_python
from keybert import KeyBERT
global final
def run(sentence1,sentencea1,semantic_per, length_per, grammar_per, keyword_per, ignr, marks, leng):
  #sentence1 = "Rowlatt Act gave the government enormous powers to suppress political activities and allowed detention of political prisoners without trial for two years. In other words, the Act proposed no appeal, no vakil and no daleel."
  #sentencea1="The Rowlatt Act granted the government broad powers to restrict political activity and permitted political prisoners to be held indefinitely without charge or trial. To put it another way, the Act proposed no appeal, vakil, or daleel." 
  summarization=pipeline("summarization")
  summary_text1=summarization(sentence1)[0]["summary_text"]
  summary_texta1=summarization(sentencea1)[0]["summary_text"]
  #summary_text2=summarization(sentence2)[0]["summary_text"]
  model = SentenceTransformer('stsb-roberta-large')
  embedding1 = model.encode(summary_text1, convert_to_tensor=True)
  embedding2 = model.encode(summary_texta1, convert_to_tensor=True)
  # compute similarity scores of two embeddings
  cosine_scores = util.pytorch_cos_sim(embedding1, embedding2)
  print("Sentence 1:", sentence1)
  print("Sentence 2:", sentencea1)
  print("Similarity score:", cosine_scores.item())
  scr=cosine_scores.item()
  m=sentencea1.split()
  if(len(m)>leng):
    lpntr=1
  else:
    lpntr=0
  l=length_per*marks*lpntr
  if scr<0.4:
    spntr=0
  elif scr<0.7:
    spntr=0.4
  elif scr<0.8:
    spntr=0.6
  else:
    spntr=1
  s=semantic_per*marks*spntr
  if s==0:
    return 0
  # using the tool  
  my_tool = language_tool_python.LanguageTool('en-US')  

  # getting the matches  
  my_matches = my_tool.check(sentencea1)  

  # defining some variables  
  myMistakes = []  
  myCorrections = []  
  startPositions = []  
  endPositions = []  

  # using the for-loop  
  for rules in my_matches:  
    if len(rules.replacements) > 0:  
        startPositions.append(rules.offset)  
        endPositions.append(rules.errorLength + rules.offset)  
        myMistakes.append(sentencea1[rules.offset : rules.errorLength + rules.offset])  
        myCorrections.append(rules.replacements[0])  
  # creating new object  
  my_NewText = list(sentencea1)   

  # rewriting the correct passage  
  for n in range(len(startPositions)):  
    for i in range(len(sentencea1)):  
        my_NewText[startPositions[n]] = myCorrections[n]  
        if (i > startPositions[n] and i < endPositions[n]):  
            my_NewText[i] = ""  

  my_NewText = "".join(my_NewText)  

  # printing the text  
  print(my_NewText)
  print(list(zip(myMistakes, myCorrections)))
  o=len(my_matches)-ignr
  if o>4:
    lpntr=0
  elif o>3:
    lpntr=0.25
  elif o>2:
    lpntr=0.5
  elif o>1:
    lpntr=0.75
  else:
    lpntr=1

  g=marks*grammar_per*lpntr
  print(g)

  kw_model = KeyBERT()
  keywords1 = kw_model.extract_keywords(summary_text1)
  keywords2 = kw_model.extract_keywords(summary_texta1)
  print(keywords1)
  print(keywords2)

  v=[]
  d=[]
  for i in keywords1:
    v.append(i[0])
  for j in keywords2:
    d.append(j[0])

  a_set = set(v)
  b_set = set(d)

  kk=list(set(v) & set(d))
  kk
  cnt=len(kk)
  if cnt-1<=len(keywords1):
    kpntr=1
  elif cnt-3<=len(keywords1):
    kpntr=0.8
  elif cnt-5<=len(keywords1):
    kpntr=0.6
  else:
    kpntr=0

  if cnt==0:
    kpntr=0

  k=kpntr*marks*keyword_per

  fin=g+s+l+k
  final=fin
  return (fin)