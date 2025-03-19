MongoDB Aggregation Pipeline

https://chatgpt.com/share/67da44d5-e984-8004-bfe1-fa9e8aad7638

Aggregation Pipeline में एक array of stages होते हैं, जो स्टेप-बाय-स्टेप डेटा प्रोसेस करते हैं।

db.collection.aggregate([
  { stage1 },
  { stage2 },
  { stage3 }
])



MongoDB में मुख्य Aggregation Stages:

$match → डेटा फ़िल्टर करने के लिए (WHERE की तरह)
$group → डेटा को ग्रुप करके समरी निकालने के लिए (GROUP BY की तरह)
$project → केवल कुछ फ़ील्ड्स चुनने और नए फ़ील्ड जोड़ने के लिए
$sort → डेटा को सॉर्ट करने के लिए
$limit → रिजल्ट्स की संख्या सीमित करने के लिए
$lookup → दूसरी कलेक्शन से डेटा लाने के लिए (JOIN की तरह)
$unwind → Array को individual documents में बदलने के लिए
