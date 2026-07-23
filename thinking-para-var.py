import json
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI

load_dotenv()

# Pydantic models for structured output
class SentenceCorrectnessFeedback(BaseModel):
    """Correctness assessment for a single sentence including grammar and spelling."""
    score: int = Field(description="Correctness score (0-100)")
    feedback: str = Field(description="Correctness feedback. Max 20 words.")
    fixes: list[str] = Field(description="List of grammar/spelling fixes")
    correctedSentence: str = Field(description="Corrected version of the sentence")


class CorrectnessFeedback(BaseModel):
    """Correctness assessment of the entire rewritten paragraph."""
    score: int = Field(description="Overall correctness score (0-100)")
    sentences: list[SentenceCorrectnessFeedback] = Field(
        description="Check spelling & grammar for each sentence in the rewritten paragraph"
    )


class MeaningPreservationFeedback(BaseModel):
    """Meaning Preservation assessment of the rewritten paragraph."""
    score: int = Field(description="Meaning Preservation score (0-100)")
    feedback: str = Field(description="How well the overall meaning and structure are preserved. Max 20 words.")


class ParagraphVariationFeedback(BaseModel):
    """Complete feedback for paragraph variation practice."""
    originalParagraph: str = Field(description="The original paragraph")
    rewrittenParagraph: str = Field(description="The learner's rewritten paragraph")
    feedback: str = Field(description="Overall feedback. Max 20 words.")
    correctness: CorrectnessFeedback
    meaningPreservation: MeaningPreservationFeedback


feedback_template = """## Task
Review the rewritten paragraph and give feedback on correctness and meaning preservation.

## Inputs
- **Original paragraph:** {original_paragraph}
- **Rewritten paragraph:** {rewritten_paragraph}
"""

feedback_prompt_template = PromptTemplate(
    input_variables=["original_paragraph", "rewritten_paragraph"], template=feedback_template
)

llm = ChatOpenAI(model="gpt-4.1-nano-2025-04-14")
llm_with_structured_output = llm.with_structured_output(ParagraphVariationFeedback)
chain = feedback_prompt_template | llm_with_structured_output

# Test input
test_original_paragraph = "The weather was beautiful. I decided to go for a walk. The park was full of people enjoying the day. I met an old friend there."
test_rewritten_paragraph = "Beautiful weather inspired me to visit the park, where I unexpectedly encountered an old friend among the many people enjoying the day."

response = chain.invoke(
    input={
        "original_paragraph": test_original_paragraph,
        "rewritten_paragraph": test_rewritten_paragraph,
    }
)

# Display the structured response
print(json.dumps(response.model_dump(), indent=2))
