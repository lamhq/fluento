import json
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI

load_dotenv()

# Pydantic models for structured output
class CorrectnessFeedback(BaseModel):
    """Correctness assessment including grammar and spelling."""
    score: int = Field(description="Correctness score (0-100)")
    feedback: str = Field(description="Correctness feedback. Max 20 words.")
    fixes: list[str] = Field(description="List of grammar/spelling fixes")
    correctedSentence: str = Field(description="Corrected version of the sentence")


class CompletenessFeedback(BaseModel):
    """Completeness assessment of required words usage."""
    score: int = Field(description="Completeness score (0-100)")
    feedback: str = Field(description="Which words are missing or improperly used. Max 20 words.")


class AlternativeSentence(BaseModel):
    """An alternative sentence that is more fluid and natural."""
    sentence: str = Field(description="Alternative sentence")


class SentenceConstructionFeedback(BaseModel):
    """Complete feedback for sentence construction practice."""
    words: list[str] = Field(description="The required words")
    sentence: str = Field(description="The learner's response")
    feedback: str = Field(description="Overall feedback. Max 20 words.")
    correctness: CorrectnessFeedback
    completeness: CompletenessFeedback
    alternatives: list[AlternativeSentence] = Field(
        description="Three sentences that feel more fluid and natural"
    )


feedback_template = """## Task
Review the provided sentence and give feedback on correctness and word usage.

## Inputs
- **Words:** {words}
- **Sentence:** {sentence}
"""

feedback_prompt_template = PromptTemplate(
    input_variables=["words", "sentence"], template=feedback_template
)

llm = ChatOpenAI(model="gpt-4.1-nano-2025-04-14")
llm_with_structured_output = llm.with_structured_output(SentenceConstructionFeedback)
chain = feedback_prompt_template | llm_with_structured_output

# Test input
test_words = ["hope", "travel", "soon"]
test_sentence = "I hope to travel soon."

response = chain.invoke(
    input={"words": ", ".join(test_words), "sentence": test_sentence}
)

# Display the structured response
print(json.dumps(response.model_dump(), indent=2))
