
// [!] fichier temporaire pour avoir un contenu de conversation
// avant que ce soit mis en place dans la database

export default function generateMessageExample(
  me: Pongie,
  pongie: Pongie
): PrivateMsgType[] {
  const messagesExample: PrivateMsgType[] = [
    {
      content: "Bonjour cher ami",
      sender: pongie,
      date: new Date("July 20, 69 20:17:40 GMT+00:00"),
    },

    {
      content: "Yop ! on se fait une game ?",
      sender: me,
      date: new Date("July 20, 69 22:17:40 GMT+00:00"),
    },

    {
      content: "J'ai trop envie de cruncher !",
      sender: me,
      date: new Date(1994, 12, 10, 9),
    },

    {
      content: "Allez, let's Pong !",
      sender: pongie,
      date: new Date(1994, 12, 10, 12),
    },

    {
      content:
        "When I find myself in times of trouble" +
        "Pikachu comes to me" +
        "Speaking words of wisdom, let it be" +
        "And in my hour of darkness" +
        "Charizard is standing right in front of me" +
        "Whispering words of wisdom, let it be",
      sender: me,
      date: new Date("March 13, 08 04:20"),
    },

    {
      content:
        +"Let it be, let it be" +
        "Let it be, let it be" +
        "Whisper words of wisdom, let it be",
      sender: me,
      date: new Date("March 14, 09 07:26"),
    },

    {
      content:
        +"And when the night is cloudy" +
        "Jigglypuff starts to sing" +
        "Soothing melodies, let it be" +
        "Oh, when the broken-hearted people" +
        "Find solace in the sea" +
        "Vaporeon shows us all, let it be",
      sender: me,
      date: new Date("March 14, 09 07:27"),
    },

    {
      content:
        +"Let it be, let it be" +
        "Let it be, let it be" +
        "Find solace in the sea, let it be",
      sender: me,
      date: new Date(),
    },

    {
      content:
        +"And when the morning sunlight" +
        "Reflects off Butterfree's wings" +
        "We know that love will guide the way, let it be" +
        "For though they may be parted" +
        "Espeon and Umbreon still shine their light" +
        "Leading us to peace, let it be",
      sender: me,
      date: new Date(),
    },

    {
      content:
        +"Let it be, let it be" +
        "Let it be, let it be" +
        "Shining light of peace, let it be",
      sender: me,
      date: new Date(),
    },

    {
      content:
        +"Let it be, let it be" +
        "Let it be, let it be" +
        "Whisper words of wisdom, let it be",
      sender: me,
      date: new Date(),
    },

    {
      content: "Bonjour cher ami",
      sender: pongie,
      date: new Date(),
    },

    {
      content: "Yop ! on se fait une game ?",
      sender: me,
      date: new Date(),
    },

    {
      content: "J'ai trop envie de cruncher !",
      sender: me,
      date: new Date(),
    },

    {
      content: "Allez, let's Pong !",
      sender: pongie,
      date: new Date(),
    },

    // {
    //   content:
    //     "When I find myself in times of trouble" +
    //     "Pikachu comes to me" +
    //     "Speaking words of wisdom, let it be" +
    //     "And in my hour of darkness" +
    //     "Charizard is standing right in front of me" +
    //     "Whispering words of wisdom, let it be",
    //   sender: me,
    //   date: new Date(),
    // },

    // {
    //   content:
    //     +"Let it be, let it be" +
    //     "Let it be, let it be" +
    //     "Whisper words of wisdom, let it be",
    //   sender: me,
    //   date: new Date(),
    // },

    // {
    //   content:
    //     +"And when the night is cloudy" +
    //     "Jigglypuff starts to sing" +
    //     "Soothing melodies, let it be" +
    //     "Oh, when the broken-hearted people" +
    //     "Find solace in the sea" +
    //     "Vaporeon shows us all, let it be",
    //   sender: me,
    //   date: new Date(),
    // },

    // {
    //   content:
    //     +"Let it be, let it be" +
    //     "Let it be, let it be" +
    //     "Find solace in the sea, let it be",
    //   sender: me,
    //   date: new Date(),
    // },

    // {
    //   content:
    //     +"And when the morning sunlight" +
    //     "Reflects off Butterfree's wings" +
    //     "We know that love will guide the way, let it be" +
    //     "For though they may be parted" +
    //     "Espeon and Umbreon still shine their light" +
    //     "Leading us to peace, let it be",
    //   sender: me,
    //   date: new Date(),
    // },

    // {
    //   content:
    //     +"Let it be, let it be" +
    //     "Let it be, let it be" +
    //     "Shining light of peace, let it be",
    //   sender: me,
    //   date: new Date(),
    // },

    // {
    //   content:
    //     +"Let it be, let it be" +
    //     "Let it be, let it be" +
    //     "Whisper words of wisdom, let it be",
    //   sender: me,
    //   date: new Date(),
    // },
  ];

  return messagesExample;
}
