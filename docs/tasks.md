# Tasks

## Task list

- [x] docs: brainstorm ideas for the app
- [x] docs: create Project Overview document
- [x] docs: complete ideas note for core features
- [x] feat: init python project with `uv`
- [x] feat: install langchain langchain-openai dotenv
- [x] feat: create `.env` file with `OPENAI_API_KEY`
- [x] feat: write an MVP script for the  Communication Practice module
- [ ] docs: review doc of Thinking Practice module
- [ ] feat: write an MVP script for the Thinking Practice module
- [ ] docs: review doc of Vocabulary Practice module
- [ ] feat: write an MVP script for the Vocabulary Practice module
- [ ] docs: review doc of Speaking Practice module
- [ ] feat: write an MVP script for the Speaking Practice module
- [ ] docs: create Project Structure document

## Brainstorm ideas for the app

## Create project overview document

## write a MVP script for Communication Practice module

- [ ] write pseudo code to demonstrate the flow 
- [ ] write a python script for the Practice Flow

**pseudo code**:

```py
practice_prompts = [
    "How are you doing?", 
    "How are you?", 
    "How have you been?"
]
practice_sentences = [
    "I'm doing well, thank you", 
    "I'm good, thanks", 
    "I'm fine, thank you"
]
meaning = "you are okay and you are thankful for asking"
prompt = random.choice(practice_prompts)

# collect user input
print(prompt)
user_response = get_user_input(prompt="Your answer: ")

# check spelling & grammar of user response
correctness_check = check_correctness(user_response)
print(correctness_check.score) # x/100
print(correctness_check.fixes) # string[]
print(correctness_check.corrected_sentence) # string

# check response is similar with the practice sentences
similarity_check = check_similarity(
    user_response, 
    practice_sentences
)
print(similarity_check.score) # x/100

# check response is relevant with prompt
appropriateness_check = check_relevance(
    user_response,
    prompt
)
print(appropriateness_check.score) # x/100
```
