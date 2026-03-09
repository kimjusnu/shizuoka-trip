export const infoData = {
  flights: {
    outbound: "7C1601 | 인천 T1 07:05 → 시즈오카 09:00",
    inbound: "7C1604 | 시즈오카 18:10 → 인천 T1 20:25",
    baggage: "1인 15kg",
    agencyRef: "G1F4PK",
    airlineRef: "N5NC6Y (7C)",
    passengers: [
      { name: "김준수", ticket: "8065594005272" },
      { name: "박서연", ticket: "8065594005271" },
    ],
  },
  checklist: [
    { id: "c1", title: "여권 / e-ticket 캡처 / 숙소 예약서", done: false },
    { id: "c2", title: "현금 + 카드 / 교통카드 / 동전지갑", done: false },
    { id: "c3", title: "보조배터리 / 충전선 / 멀티어댑터", done: false },
    { id: "c4", title: "편한 신발 / 얇은 겉옷 / 우산 또는 우비", done: false },
    { id: "c5", title: "상비약 / 멀미약 / 소화제 / 밴드", done: false },
    { id: "c6", title: "공항버스 PDF 최신판 확인", done: false },
    { id: "c7", title: "미호노 마츠바라 주말 버스 확인", done: false },
    { id: "c8", title: "후지노미야↔타누키호수 버스 확인", done: false },
  ],
  phrases: [
    { jp: "このバスは静岡駅に行きますか？", kr: "이 버스 시즈오카역 가나요?" },
    { jp: "荷物を先に預けてもいいですか？", kr: "짐 먼저 맡겨도 될까요?" },
    {
      jp: "田貫湖に行きたいです。休暇村富士で降ります。",
      kr: "타누키호수에 가고 싶어요. 큐카무라후지에서 내립니다.",
    },
    {
      jp: "カード使えますか？ / 現金だけですか？",
      kr: "카드 되나요? / 현금만 되나요?",
    },
    { jp: "写真を撮ってもいいですか？", kr: "사진 찍어도 될까요?" },
  ],
};
