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


class MeaningPreservationFeedback(BaseModel):
    """Meaning Preservation assessment of the rewritten sentence."""
    score: int = Field(description="Meaning Preservation score (0-100)")
    feedback: str = Field(description="How well the meaning is preserved. Max 20 words.")


class AlternativeSentence(BaseModel):
    """An alternative sentence that is more fluid and natural."""
    sentence: str = Field(description="Alternative sentence")


class SentenceVariationFeedback(BaseModel):
    """Complete feedback for sentence variation practice."""
    originalSentence: str = Field(description="The original sentence")
    rewrittenSentence: str = Field(description="The learner's rewritten sentence")
    feedback: str = Field(description="Overall feedback. Max 20 words.")
    correctness: CorrectnessFeedback
    meaningPreservation: MeaningPreservationFeedback
    alternatives: list[AlternativeSentence] = Field(
        description="Three sentences that feel more fluid and natural"
    )


feedback_template = """## Task
Review the rewritten sentence and give feedback on correctness and meaning preservation.

## Inputs
- **Original sentence:** {original_sentence}
- **Rewritten sentence:** {rewritten_sentence}
"""

feedback_prompt_template = PromptTemplate(
    input_variables=["original_sentence", "rewritten_sentence"], template=feedback_template
)

llm = ChatOpenAI(model="gpt-4.1-nano-2025-04-14")
llm_with_structured_output = llm.with_structured_output(SentenceVariationFeedback)
chain = feedback_prompt_template | llm_with_structured_output

# Test input
test_original_sentence = "I really enjoyed the movie."
test_rewritten_sentence = "The movie was really enjoyable."

response = chain.invoke(
    input={
        "original_sentence": test_original_sentence,
        "rewritten_sentence": test_rewritten_sentence,
    }
)

# Display the structured response
print(json.dumps(response.model_dump(), indent=2))
