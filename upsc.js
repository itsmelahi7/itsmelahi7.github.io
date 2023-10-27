function parseUpscQuestion(questionString) {
    const que_obj = {};

    // Extract text
    que_obj.text = questionString.substring(0, questionString.indexOf("("));

    // Extract categories
    const categoriesMatch = questionString.match(/\(([^)]+)\)/);
    if (categoriesMatch) {
        que_obj.categories = categoriesMatch[1].split(",").map((category) => category.trim());
    }

    // Extract ans
    const ansMatch = questionString.match(/\[ans=(\d+)\]/);
    if (ansMatch) {
        que_obj.ans = parseInt(ansMatch[1], 10);
    }

    // Extract block_uid
    const blockUidMatch = questionString.match(/\*\*(.*?)\*\*/);
    if (blockUidMatch) {
        que_obj.block_uid = blockUidMatch[1];
    }

    return que_obj;
}
