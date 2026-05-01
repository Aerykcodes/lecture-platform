import pickle
import nltk
from nltk.tokenize import sent_tokenize

# Download tokenizer once
nltk.download('punkt')

# Load model
with open("app/models/action_model.pkl", "rb") as f:
    model = pickle.load(f)


def extract_actions(text):
    sentences = sent_tokenize(text)
    actions = []

    for sentence in sentences:
        sentence = sentence.strip()
        if not sentence:
            continue

        prediction = model.predict([sentence])[0]

        if prediction == 1:
            actions.append(sentence)

    return actions
