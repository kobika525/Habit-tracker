def serialize_doc(doc: dict) -> dict:
    """Convert a MongoDB document into a JSON-friendly dict with string ids."""
    if not doc:
        return doc

    result = dict(doc)
    result["_id"] = str(result["_id"])

    for field in ("user", "habit"):
        if field in result and result[field] is not None:
            result[field] = str(result[field])

    for field in ("createdAt", "updatedAt"):
        if field in result and result[field] is not None:
            result[field] = result[field].isoformat()

    return result
