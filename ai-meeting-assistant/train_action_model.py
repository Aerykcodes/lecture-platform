import pickle
from sklearn.pipeline import Pipeline
from sklearn.linear_model import LogisticRegression
from sklearn.feature_extraction.text import TfidfVectorizer

# =========================
# DATASET (Expanded + Noisy)
# =========================

sentences = [

# ===== ACTIONS (1) =====

# Business
"We will finalize the budget tomorrow",
"Please prepare the financial report",
"I will send the proposal to the client",
"Let's schedule a follow-up meeting",
"We need to review the contract",
"Assign this task to the finance team",
"I will handle client communication",
"Please update the timeline",
"Let's finalize the deal this week",
"We should prepare a presentation",

# Tech
"We need to fix the login issue",
"Deploy the latest version",
"I will review the pull request",
"Please optimize database queries",
"Let's complete testing by Friday",
"We should refactor this module",
"I will handle backend integration",
"Please update API docs",
"Let's push the code",
"We need to resolve this bug",

# Marketing
"We should launch the campaign",
"I will create social posts",
"Please design the banner",
"Let's analyze campaign results",
"We need to improve engagement",
"Assign this to marketing",
"I will prepare content calendar",
"Please review ad copy",
"Let's finalize branding",
"We should target new audience",

# HR
"Schedule interviews for next week",
"I will contact candidates",
"Please prepare onboarding docs",
"We need to evaluate employees",
"Let's organize training",
"Assign mentors to new hires",
"I will update HR policies",
"Please review leave requests",
"We should conduct survey",
"Let's finalize hiring plan",

# General life
"I will book tickets",
"Please call the vendor",
"Let's plan the event",
"We need to organize files",
"I will handle logistics",
"Please confirm booking",
"Let's finalize venue",
"We should prepare checklist",
"I will follow up",
"Please send details",

# Deadlines
"Complete this by tomorrow",
"Finish report before Friday",
"Submit document by EOD",
"Prepare everything before meeting",
"Send update tonight",

# Names
"John will handle backend",
"Shweta should review proposal",
"Rahul will prepare report",
"Priya will coordinate meeting",

# Questions implying action
"Can you send the report?",
"Could you review this?",
"Will you handle deployment?",
"Can someone update file?",

# Noisy / real speech
"Uhh we should probably finish this tomorrow",
"Yeah so can you send that report",
"I think we need to fix this issue",
"Let’s just finalize this quickly",
"So yeah I’ll take care of that",
"Okay you handle backend and I'll do frontend",
"Maybe we should deploy it today",
"Alright let's just wrap this up and push code",
"Hey can you just update that doc real quick",
"Yeah I'll look into that issue",

# ===== NON-ACTIONS (0) =====

"The budget looks reasonable",
"This proposal seems strong",
"The client is satisfied",
"The report looks detailed",
"This strategy is effective",
"The timeline is tight",
"The discussion was productive",
"The numbers are promising",

"The system is running smoothly",
"The UI looks clean",
"The API response is fast",
"This feature works well",
"The bug is difficult",
"The performance is decent",
"This implementation is correct",
"The logs show errors",

"The campaign performed well",
"The engagement is high",
"This design looks attractive",
"The audience response is good",
"The branding is strong",
"The ad looks good",

"The candidates are strong",
"The feedback is positive",
"The team is performing well",
"The morale is high",

"The topic is interesting",
"The results are accurate",
"This explanation is clear",
"The paper is well written",

"The event was successful",
"The place looks nice",
"The weather is good",
"This idea is interesting",

# Opinions
"I think this is a good idea",
"This might work",
"I feel this could improve",
"This seems complex",
"I believe this is correct",
"This looks fine to me",

# Observations
"The system is slow",
"The response time is high",
"The issue is unclear",
"The output is incorrect",
"This looks broken",

# Noisy non-actions
"Uhh yeah this looks kinda fine",
"I mean it's working I guess",
"Yeah so this seems okay",
"I think it's alright overall",
"Hmm this might be an issue"
]

labels = [1]*80 + [0]*(len(sentences)-80)

# =========================
# MODEL PIPELINE
# =========================

pipeline = Pipeline([
    ("tfidf", TfidfVectorizer(
        ngram_range=(1,2),
        stop_words="english",
        max_features=5000
    )),
    ("clf", LogisticRegression(max_iter=200))
])

# Train
pipeline.fit(sentences, labels)

# Save model
with open("action_model.pkl", "wb") as f:
    pickle.dump(pipeline, f)

print("✅ Model trained and saved as action_model.pkl")
