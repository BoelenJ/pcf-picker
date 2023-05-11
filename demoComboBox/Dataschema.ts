export const dataExample = {
    "Count": 2,
    "Records": [
        {
            "Key": "1",
            "Value": "One"
        }
    ]
}

export const dataSchema = {
    "$schema": "http://json-schema.org/draft-04/schema#",
    "type": "object",
    "properties": {
        "Count": {
            "type": "integer"
        },
        "Records": {
            "type": "array",
            "items":
            {
                "type": "object",
                "properties": {
                    "Key": {
                        "type": "string"
                    },
                    "Value": {
                        "type": "string"
                    }
                }
            }
        }
    }
};