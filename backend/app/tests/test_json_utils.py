from app.services.json_utils import repair_and_parse_json

def test_repair_and_parse_valid_json():
    text = '{"summary": "Test", "riskLevel": "high"}'
    res = repair_and_parse_json(text)
    assert res["summary"] == "Test"
    assert res["riskLevel"] == "high"

def test_repair_and_parse_markdown_json():
    text = '''
```json
{
  "summary": "Test Markdown",
  "riskLevel": "low"
}
```
'''
    res = repair_and_parse_json(text)
    assert res["summary"] == "Test Markdown"
    assert res["riskLevel"] == "low"
