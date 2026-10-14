/**
 * Bộ lời chúc 20/10 — chọn ổn định theo seed (id/tên khách) để mỗi người
 * nhận một bộ lời chúc riêng, không đổi mỗi lần mở lại thiệp.
 */

export type Page2Wish = {
  intro: string
  body: string
  closing: string
}

export type Page3Wish = {
  paragraph1: string
  paragraph2: string
  thanksLine: string
}

const PAGE_2_WISHES: Page2Wish[] = [
  {
    intro:
      'Nhân ngày 20/10, Bateco Group xin gửi đến Chị lời chúc thật chân thành và ấm áp.',
    body: 'Cảm ơn Chị đã luôn cố gắng mỗi ngày, vừa làm việc chỉn chu vừa mang lại không khí dễ chịu cho mọi người xung quanh. Những điều đó có vẻ nhỏ, nhưng lại khiến cả tập thể thấy ấm hơn rất nhiều.',
    closing:
      'Chúc Chị ngày 20/10 vui vẻ, được nghỉ ngơi đúng lúc và được quan tâm nhiều hơn một chút — không chỉ hôm nay mà cả những ngày thường!',
  },
  {
    intro: 'Chúc mừng ngày Phụ nữ Việt Nam 20/10!',
    body: 'Bateco Group cảm ơn Chị vì sự tận tâm trong công việc. Có Chị, mọi việc trở nên nhẹ nhàng và đáng tin cậy hơn rất nhiều — đó là điều cả team đều cảm nhận được.',
    closing:
      'Chúc Chị luôn khỏe, luôn vui, và có thật nhiều khoảnh khắc đáng nhớ bên những người thương quý.',
  },
  {
    intro: 'Nhân dịp 20/10, cả tập thể Bateco xin gửi lời chúc ấm áp tới Chị.',
    body: 'Cảm ơn Chị đã đồng hành cùng mọi người suốt thời gian qua. Những đóng góp của Chị không cần nói nhiều — ai cũng thấy, và ai cũng trân trọng.',
    closing:
      'Chúc Chị một ngày thật dễ chịu, làm gì cũng thấy vui, và được dành chút thời gian cho chính mình!',
  },
  {
    intro: 'Ngày 20/10 này, Bateco Group xin chúc Chị thật nhiều điều tốt đẹp.',
    body: 'Cảm ơn Chị vì lúc nào cũng chu đáo và sẵn sàng hỗ trợ. Có những việc nhỏ nhưng lại tạo nên sự khác biệt lớn trong tập thể — và Chị đang làm đúng những việc đó mỗi ngày.',
    closing:
      'Chúc Chị được yêu thương, được lắng nghe, và được là chính mình một cách thoải mái nhất.',
  },
  {
    intro: 'Bateco Group xin gửi lời chúc 20/10 đến Chị — chân thành và gần gũi.',
    body: 'Cảm ơn Chị đã góp phần tạo nên một môi trường làm việc tử tế. Sự hiện diện của Chị khiến mọi người thấy gần nhau hơn, và công việc cũng dễ thở hơn.',
    closing:
      'Chúc Chị ngày lễ vui vẻ, có thật nhiều niềm vui bất ngờ, và được nghỉ một chút giữa những ngày bận rộn!',
  },
  {
    intro:
      'Nhân ngày tôn vinh phụ nữ Việt Nam, xin gửi tới Chị lời chúc từ Bateco Group.',
    body: 'Cảm ơn Chị vì sự chịu khó và tinh thần trách nhiệm. Những điều đó không ồn ào, không cần khoe ra, nhưng lại rất đáng quý với những người làm việc cùng Chị.',
    closing:
      'Chúc Chị luôn bình yên, được đối xử thật tốt mỗi ngày, và giữ được nụ cười của mình.',
  },
  {
    intro: 'Chúc Chị ngày 20/10 thật vui và thật nhẹ nhàng!',
    body: 'Bateco Group cảm ơn Chị đã luôn cố gắng hết mình. Công việc có lúc áp lực, nhưng Chị vẫn giữ được sự tận tâm — điều đó rất đáng trân trọng, và mọi người đều thấy.',
    closing:
      'Chúc Chị được nghỉ một chút, cười nhiều hơn, và thấy mình được nâng đỡ đúng lúc cần nhất.',
  },
  {
    intro: 'Nhân 20/10, Bateco Group xin gửi đến Chị lời cảm ơn chân thành.',
    body: 'Cảm ơn Chị vì đã ở đây, vì đã làm tốt phần việc của mình, và vì đã làm cho tập thể dễ thở hơn chỉ bằng cách luôn sẵn sàng giúp đỡ.',
    closing:
      'Chúc Chị một ngày đặc biệt đúng như tên gọi của nó — đặc biệt với chính Chị, theo cách Chị muốn.',
  },
  {
    intro:
      'Ngày Phụ nữ Việt Nam 20/10, xin chúc Chị thật nhiều sức khỏe và niềm vui.',
    body: 'Bateco Group trân trọng sự đồng hành của Chị. Có những ngày bận rộn, nhưng nhờ có Chị mà mọi thứ vẫn đi đúng hướng — và cả team đều biết ơn vì điều đó.',
    closing:
      'Chúc Chị được quan tâm nhiều hơn, không chỉ hôm nay mà cả những ngày thường xuyên nhất.',
  },
  {
    intro: 'Bateco Group xin chúc mừng Chị nhân ngày 20/10.',
    body: 'Cảm ơn Chị đã mang đến sự chỉn chu trong công việc. Đó là thứ không phải ai cũng làm được mỗi ngày — và vì thế nó càng đáng được ghi nhận.',
    closing:
      'Chúc Chị vui vẻ, thoải mái, và có một ngày 20/10 đáng nhớ bên những điều giản dị nhưng ấm áp!',
  },
  {
    intro: 'Nhân dịp 20/10, xin gửi tới Chị lời chúc từ cả nhà Bateco.',
    body: 'Cảm ơn Chị vì đã luôn ở đó khi cần. Những hỗ trợ của Chị có khi chẳng ai nói ra thành lời, nhưng mọi người đều nhớ — và đều cảm ơn theo cách riêng của mình.',
    closing:
      'Chúc Chị được hạnh phúc theo cách đơn giản và thật nhất, không cần gì lớn lao.',
  },
  {
    intro: 'Ngày 20/10 đến rồi — Bateco Group xin chúc Chị một ngày thật ấm.',
    body: 'Cảm ơn Chị đã góp công sức cho tập thể. Không cần lời hoa mỹ, chỉ cần nói rằng: có Chị là tốt hơn rất nhiều, và mọi người đều cảm nhận được điều đó.',
    closing:
      'Chúc Chị cười nhiều, lo ít, và được chiều chuộng đúng lúc cần — hôm nay và cả sau này.',
  },
  {
    intro: 'Xin chúc Chị ngày Phụ nữ Việt Nam vui vẻ và ấm áp!',
    body: 'Bateco Group cảm ơn Chị vì sự chịu khó và thái độ làm việc tốt. Đó là điều giúp cả team tiến lên mỗi ngày, dù đôi khi chẳng ai kịp nói lời cảm ơn.',
    closing:
      'Chúc Chị luôn được đối xử tử tế — vì Chị cũng đang sống tử tế như thế với mọi người xung quanh.',
  },
  {
    intro: 'Nhân 20/10, Bateco Group xin gửi lời chúc đến Chị.',
    body: 'Cảm ơn Chị đã làm việc trách nhiệm và mang lại sự tin cậy cho mọi người. Có Chị trong team là một điều may — và cả tập thể đều biết điều đó.',
    closing:
      'Chúc Chị khỏe mạnh, vui vẻ, và được yêu thương nhiều hơn một chút hôm nay cũng như những ngày tới!',
  },
  {
    intro: 'Chúc mừng 20/10 từ Bateco Group!',
    body: 'Cảm ơn Chị vì đã luôn cố gắng. Dù việc lớn hay việc nhỏ, Chị đều làm với sự tận tâm — và điều đó rất đáng được ghi nhận, không chỉ nhân ngày lễ.',
    closing:
      'Chúc Chị một ngày nhẹ nhàng, đầy hoa, và thật nhiều lời cảm ơn chân thành từ những người quanh mình.',
  },
]

const PAGE_3_WISHES: Page3Wish[] = [
  {
    paragraph1:
      '20/10 không chỉ là ngày nhận hoa hay lời chúc. Đó còn là lúc để mỗi người phụ nữ nhớ rằng mình cũng cần được quan tâm — không kém gì những người mình vẫn đang chăm sóc mỗi ngày.',
    paragraph2:
      'Hãy cho phép bản thân chậm lại một chút — cười nhiều hơn, lo lắng ít hơn, và dành chút thời gian chỉ cho riêng mình.',
    thanksLine: 'vì đã luôn cố gắng theo cách rất riêng của mình.',
  },
  {
    paragraph1:
      'Ngày 20/10 này, xin nhắc Chị một điều giản dị: Chị không cần hoàn hảo mới xứng đáng được yêu thương. Chị đã đủ tốt rồi — chỉ cần được nhìn thấy đúng cách.',
    paragraph2:
      'Chỉ cần là chính mình — đã là đủ đẹp, đủ đáng trân trọng rồi.',
    thanksLine: 'vì đã mang đến sự ấm áp cho những người quanh mình.',
  },
  {
    paragraph1:
      'Phụ nữ đẹp không phải vì lúc nào cũng mạnh mẽ. Đôi khi đẹp vì dám mệt, dám nghỉ, rồi lại đứng dậy — và vẫn giữ được sự dịu dàng ấy.',
    paragraph2:
      'Chúc Chị giữ được sự dịu dàng đó — với người khác, và quan trọng hơn, với chính mình.',
    thanksLine: 'vì đã làm mọi thứ trở nên dễ chịu hơn chỉ bằng cách có mặt.',
  },
  {
    paragraph1:
      '20/10 là dịp đẹp để nói lời cảm ơn — không hoa mỹ, không dài dòng, chỉ thật lòng thôi.',
    paragraph2:
      'Cảm ơn vì Chị đã sống tử tế, đã cố gắng, và đã mang lại điều tốt cho những người xung quanh theo cách rất riêng của Chị.',
    thanksLine: 'vì đã chọn sống tốt mỗi ngày, dù không ai nhắc.',
  },
  {
    paragraph1:
      'Có những ngày Chị phải gồng lên rất nhiều. 20/10 này, xin hãy đặt gánh nặng xuống một lúc — dù chỉ là một buổi sáng hay một buổi chiều.',
    paragraph2:
      'Chị xứng đáng được nghỉ ngơi — và được nói rằng mình cũng cần được chăm sóc, không chỉ chăm sóc người khác.',
    thanksLine: 'vì đã cố gắng hết mình theo cách rất đẹp.',
  },
  {
    paragraph1:
      'Vẻ đẹp của người phụ nữ không nằm ở việc làm được tất cả. Nó nằm ở việc biết mình là ai, và vẫn đủ mềm mại để yêu thương — cả người khác lẫn chính mình.',
    paragraph2:
      'Chúc Chị giữ được điều đó — hôm nay và cả những ngày thường, khi chẳng ai nhắc đến 20/10.',
    thanksLine: 'vì đã làm thế giới quanh mình dịu hơn một chút.',
  },
  {
    paragraph1:
      '20/10 — một ngày để mỉm cười với chính mình trước khi nhận lời chúc từ người khác. Đôi khi cái cười ấy mới là món quà quan trọng nhất.',
    paragraph2:
      'Chị đã đi được rất xa rồi. Hãy tự hào về điều đó — dù có lúc Chị quên mất.',
    thanksLine: 'vì đã luôn là phiên bản thật của chính mình.',
  },
  {
    paragraph1:
      'Không phải chờ đến 20/10 Chị mới đáng được trân trọng. Nhưng hôm nay là dịp đẹp để nói ra điều đó — rõ ràng và không ngại ngùng.',
    paragraph2:
      'Chúc Chị được lắng nghe nhiều hơn — và được đối xử đúng với những gì Chị xứng đáng nhận.',
    thanksLine: 'vì đã mang lại sức sống cho mọi người xung quanh.',
  },
  {
    paragraph1:
      'Ngày Phụ nữ Việt Nam là lời cảm ơn gửi tới sự chịu đựng, sự dịu dàng và cả những lúc Chị phải rất mạnh mẽ — dù chẳng ai nhìn thấy hết.',
    paragraph2:
      'Hãy nhớ yêu bản thân mình không kém gì cách Chị đã yêu thương người khác mỗi ngày.',
    thanksLine: 'vì đã sống tử tế và cháy hết mình theo cách riêng.',
  },
  {
    paragraph1:
      '20/10 này, xin chúc Chị một điều đơn giản: được vui theo cách mình muốn — không cần phải hợp gu ai cả.',
    paragraph2:
      'Không cần phải hoàn hảo. Không cần phải gồng. Chỉ cần được là mình — và được phép nghỉ khi mệt.',
    thanksLine: 'vì đã mang đến ánh sáng rất riêng cho tập thể này.',
  },
  {
    paragraph1:
      'Có lúc công việc cuốn đi rất nhanh, đến mức quên mất mình cũng cần được nâng niu. 20/10 là lúc để nhớ lại điều đó.',
    paragraph2:
      'Hôm nay, xin dành một lời nhắc nhẹ: Chị quan trọng không kém bất kỳ ai — và xứng đáng được đối xử như vậy.',
    thanksLine: 'vì đã luôn hoàn thành tốt phần việc của một người phụ nữ tuyệt vời.',
  },
  {
    paragraph1:
      'Nhân 20/10, xin chúc Chị giữ được nụ cười — cái thứ làm mọi người thấy nhẹ lòng mỗi khi gặp, kể cả những ngày mệt mỏi nhất.',
    paragraph2:
      'Dù ngày thường hay ngày lễ, Chị đều đáng được nói lời cảm ơn — hôm nay chỉ là dịp để nói to hơn một chút.',
    thanksLine: 'vì đã mang hơi ấm và sự dễ chịu đến những người quanh mình.',
  },
]

/** Hash nhỏ, ổn định — đủ để chọn lời chúc theo khách. */
export const hashSeed = (seed: string): number => {
  let hash = 2166136261
  for (let i = 0; i < seed.length; i += 1) {
    hash ^= seed.charCodeAt(i)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export const pickBySeed = <T>(items: readonly T[], seed: string, salt = ''): T => {
  if (items.length === 0) {
    throw new Error('pickBySeed: empty list')
  }
  const index = hashSeed(`${seed}::${salt}`) % items.length
  return items[index]!
}

export const pickPage2Wish = (seed: string): Page2Wish => pickBySeed(PAGE_2_WISHES, seed, 'page2')

export const pickPage3Wish = (seed: string): Page3Wish => pickBySeed(PAGE_3_WISHES, seed, 'page3')

/** Tách tên hiển thị 2 dòng kiểu thiệp: "Chị Trần Thị" / "Kim Trâm". */
export const splitDisplayName = (
  honorific: string | undefined,
  name: string,
): { line1: string; line2: string } => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) {
    return { line1: honorific?.trim() || 'Chị', line2: 'Yêu quý' }
  }
  if (parts.length === 1) {
    return {
      line1: honorific?.trim() || 'Chị',
      line2: parts[0]!,
    }
  }
  if (parts.length === 2) {
    return {
      line1: [honorific, parts[0]].filter(Boolean).join(' '),
      line2: parts[1]!,
    }
  }
  return {
    line1: [honorific, ...parts.slice(0, -2)].filter(Boolean).join(' '),
    line2: parts.slice(-2).join(' '),
  }
}
