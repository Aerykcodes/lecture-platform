from transformers import pipeline

summarizer = pipeline(
    "summarization",
    model="facebook/bart-large-cnn",
    device=-1
)

def summarize(text: str) -> str:
    text = " ".join(text.split())
    if not text:
        return "No transcript provided."

    word_count = len(text.split())

    if word_count < 400:
        result = summarizer(
            text,
            max_length=200,
            min_length=80,
            do_sample=False,
            truncation=True
        )
        return result[0]["summary_text"]

    words      = text.split()
    chunk_size = 500
    chunks     = [
        " ".join(words[i:i + chunk_size])
        for i in range(0, len(words), chunk_size)
    ]

    chunk_summaries = []
    for chunk in chunks:
        if len(chunk.split()) < 30:
            chunk_summaries.append(chunk)
            continue
        result = summarizer(
            chunk,
            max_length=150,
            min_length=50,
            do_sample=False,
            truncation=True
        )
        chunk_summaries.append(result[0]["summary_text"])

    combined = " ".join(chunk_summaries)
    combined = " ".join(combined.split()[:500])

    final = summarizer(
        combined,
        max_length=300,
        min_length=120,
        do_sample=False,
        truncation=True
    )
    return final[0]["summary_text"]
