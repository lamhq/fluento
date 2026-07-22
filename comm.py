import json
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI

load_dotenv()

# Pydantic models for structured output
class ClarityFeedback(BaseModel):
    """Clarity assessment of the response."""
    score: int = Field(description="Clarity score (0-100)")
    feedback: str = Field(description="Clarity feedback. Max 20 words.")


class PoliteFeedback(BaseModel):
    """Politeness assessment of the response."""
    score: int = Field(description="Politeness score (0-100)")
    feedback: str = Field(description="Politeness feedback. Max 20 words.")


class ToneFeedback(BaseModel):
    """Tone assessment of the response."""
    score: int = Field(description="Tone score (0-100)")
    feedback: str = Field(description="Tone feedback. Max 20 words.")


class CorrectnessFeedback(BaseModel):
    """Correctness assessment including grammar and spelling."""
    score: int = Field(description="Correctness score (0-100)")
    feedback: str = Field(description="Correctness feedback. Max 20 words.")
    fixes: list[str] = Field(description="List of grammar/spelling fixes")
    correctedSentence: str = Field(description="Corrected version of the sentence")


class AppropriatenessFeedback(BaseModel):
    """Appropriateness assessment of the response."""
    score: int = Field(description="Overall appropriateness score (0-100)")
    clarity: ClarityFeedback
    politeness: PoliteFeedback
    tone: ToneFeedback


class CommunicationFeedback(BaseModel):
    """Complete feedback for communication practice."""
    prompt: str = Field(description="The original prompt")
    sentence: str = Field(description="The learner's response")
    feedback: str = Field(description="Overall feedback")
    correctness: CorrectnessFeedback
    appropriateness: AppropriatenessFeedback

feedback_template = """## Task

Review my sentence and give feedback for correctness and relevance to the provided prompt.

## Inputs

- **Prompt:** {prompt}
- **Sentence:** {sentence}

## Feedback structure

Feedback includes:
- **Feedback**: overall feedback
- **Correctness**: check spelling & grammar of learner's response
  - **Score** (x/100)
  - **Feedback**: correctness feedback
  - **Grammar/spelling fixes**
  - **Corrected sentence**
- **Appropriateness**: check response is relevant with the prompt
  - **Score** (x/100): `0` if the response is irrelevant with the prompt, otherwise it's the average of clarity, politeness, and tone scores.
  - **Clarity**: Is the response easy to understand and free of ambiguity?
    - **Score** (x/100)
    - **Feedback**
  - **Politeness**: Does it show courtesy or acknowledge the other person?
    - **Score** (x/100)
    - **Feedback**
  - **Tone**: Does the emotional tone fit the situation (friendly, professional, humorous)?
    - **Score** (x/100)
    - **Feedback**
"""

feedback_prompt_template = PromptTemplate(
    input_variables=["prompt", "sentence"], template=feedback_template
)

llm = ChatOpenAI(model="gpt-4.1-nano-2025-04-14")  # took 1.81s ($0.10)
llm_with_structured_output = llm.with_structured_output(CommunicationFeedback)
chain = feedback_prompt_template | llm_with_structured_output

# Test input
test_prompt = "How are you today?"
test_sentence = "I'm doing well, thank you. And you?"

response = chain.invoke(input={"prompt": test_prompt, "sentence": test_sentence})

# Display the structured response
print(json.dumps(response.model_dump(), indent=2))

