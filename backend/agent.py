import os
import anthropic
from dotenv import load_dotenv

load_dotenv()

# Read OpenClaw files
with open("SOUL.md", "r") as f:
    SOUL = f.read()

with open("SKILL.md", "r") as f:
    SKILL = f.read()

with open("HEARTBEAT.md", "r") as f:
    HEARTBEAT = f.read()

# Combine into system prompt
SYSTEM_PROMPT = f"""
{SOUL}

{SKILL}

{HEARTBEAT}

IMPORTANT: Always respond in this exact JSON format:
{{
    "issues": [
        {{
            "api_name": "name of deprecated API",
            "issue": "what is wrong",
            "impact": "what breaks if not fixed",
            "effort": "S or M or L",
            "steps": ["step 1", "step 2", "step 3"],
            "before_code": "original deprecated code",
            "after_code": "fixed updated code"
        }}
    ]
}}
"""

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def generate_migration(detected_issues, original_code):
    if not detected_issues:
        return {"issues": []}

    user_message = f"""
Here is the original code:
{original_code}

Here are the detected deprecated APIs:
{detected_issues}

Generate a migration report for each issue.
"""

    message = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=2000,
        system=SYSTEM_PROMPT,
        messages=[
            {"role": "user", "content": user_message}
        ]
    )

    import json
    response_text = message.content[0].text
    clean = response_text.replace("```json", "").replace("```", "").strip()
    return json.loads(clean)
if __name__ == "__main__":
    test_code = "import optparse\nparser = optparse.OptionParser()"
    test_issues = [{"api_name": "optparse", "reason": "Deprecated since Python 3.2"}]
    
    result = generate_migration(test_issues, test_code)
    import json
    print(json.dumps(result, indent=2))