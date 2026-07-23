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
    feedback: str = Field(description="Correctness feedback. Max 20 words")
    fixes: list[str] = Field(description="List of grammar/spelling fixes")
    correctedSentence: str = Field(description="Corrected version of the sentence")


class VocabUsageFeedback(BaseModel):
    """Vocabulary usage assessment."""
    score: int = Field(description="Vocabulary usage score (0-100)")
    feedback: str = Field(description="How well the word/phrase is used in context. Max 20 words.")


class VocabSentenceBuilderFeedback(BaseModel):
    """Complete feedback for vocabulary sentence builder practice."""
    feedback: str = Field(description="Overall feedback. Max 20 words")
    correctness: CorrectnessFeedback
    vocabularyUsage: VocabUsageFeedback
    alternatives: list[str] = Field(
        description="Three sentences that feel more fluid and natural"
    )


feedback_template = """## Task
Review the sentence and give feedback on correctness and vocabulary usage.

## Inputs
- **Target word:** {target_word}
- **Context:** {context}
- **Sentence:** {sentence}
"""

feedback_prompt_template = PromptTemplate(
    input_variables=["target_word", "context", "sentence"], template=feedback_template
)

llm = ChatOpenAI(model="gpt-4.1-nano-2025-04-14")
llm_with_structured_output = llm.with_structured_output(VocabSentenceBuilderFeedback)
chain = feedback_prompt_template | llm_with_structured_output

# Test inputs - Practice Lesson 1
target_word_1 = "resilient"
context_1 = "workplace email"
sentence_1 = "I believe our team is resilient and can overcome this challenge."

response_1 = chain.invoke(
    input={
        "target_word": target_word_1,
        "context": context_1,
        "sentence": sentence_1,
    }
)

print(f"Target word: {target_word_1}")
print(f"Context: {context_1}")
print(f"Learner input: {sentence_1}")
print("\nFeedback:")
print(json.dumps(response_1.model_dump(), indent=2))
