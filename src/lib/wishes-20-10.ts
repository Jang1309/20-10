/**
 * Bộ lời chúc 20/10 — chọn ổn định theo seed (id/tên khách) để mỗi người
 * nhận một bộ lời chúc riêng, không đổi mỗi lần mở lại thiệp.
 */

import type { WishKind } from '@/lib/wish-kind'

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
    intro: 'Tháng Mười dịu dàng gõ cửa, Bateco Group gửi đến Chị lời chúc 20/10 thật ấm áp.',
    body: 'Giữa bộn bề công việc, Chị vẫn luôn giữ cho mọi thứ ngăn nắp, chu toàn và ấm áp. Sự chỉn chu ấy, nụ cười ấy đã trở thành điều cả tập thể Bateco vô cùng trân quý.',
    closing: 'Chúc Chị luôn rạng rỡ như nắng thu, bình yên như những sớm mai.',
  },
  {
    intro:
      'Chúc mừng ngày Phụ nữ Việt Nam 20/10! Bateco Group gửi đến Chị lời chúc chân thành nhất.',
    body: 'Có những người không cần nói nhiều, chỉ cần có mặt là mọi việc đã thấy vững vàng hơn. Ở Bateco, Chị chính là người như thế: lặng lẽ, tận tâm và luôn đáng tin cậy.',
    closing: 'Chúc Chị hôm nay hoa vây quanh, quà gõ cửa, yêu thương đong đầy.',
  },
  {
    intro: 'Nhân ngày 20/10, cả nhà Bateco xin gửi tặng Chị một bó lời chúc thật xinh.',
    body: 'Cảm ơn Chị vì những ngày tận tâm, những lần sẵn lòng sẻ chia và cả những nụ cười tiếp sức giữa ngày bận rộn. Chị đã viết nên một trang rất đẹp trong câu chuyện Bateco.',
    closing: 'Chúc Chị luôn xinh đẹp, khỏe mạnh, mỗi sớm mai đều có lý do để cười.',
  },
  {
    intro: 'Gửi Chị — một đóa hoa đẹp trong khu vườn Bateco, nhân ngày Phụ nữ Việt Nam 20/10.',
    body: 'Sự chu đáo của Chị nằm trong những điều rất nhỏ: một lời nhắc kịp lúc, một việc làm trọn vẹn, một câu hỏi han giữa ngày mệt mỏi. Chính những điều nhỏ ấy làm nên khác biệt lớn.',
    closing: 'Chúc Chị được nâng niu dịu dàng, như cách Chị vẫn quan tâm mọi người.',
  },
  {
    intro: 'Bateco Group trân trọng gửi đến Chị lời chúc mừng ngày Phụ nữ Việt Nam 20/10.',
    body: 'Một nơi làm việc tử tế không tự nhiên mà có. Nó được vun lên từ những con người như Chị: chân thành, trách nhiệm, và luôn nghĩ cho người khác trước khi nghĩ cho mình.',
    closing: 'Chúc Chị một ngày nhiều niềm vui, nhiều bất ngờ và thật ít deadline!',
  },
  {
    intro: 'Nhân ngày tôn vinh phụ nữ Việt Nam, Bateco Group xin gửi đến Chị lời tri ân sâu sắc.',
    body: 'Sự bền bỉ của Chị giống như dòng nước: lặng lẽ, không ồn ào, nhưng luôn nuôi dưỡng và nâng đỡ những người đi cùng. Bateco may mắn vì có Chị trên hành trình này.',
    closing: 'Chúc Chị lòng luôn an yên, công việc hanh thông, gia đình đầy tiếng cười.',
  },
  {
    intro: 'Chúc Chị một ngày 20/10 ngọt ngào như hương hoa sữa đầu mùa thu!',
    body: 'Có những lúc công việc dồn dập như mưa, vậy mà Chị vẫn giữ được sự điềm tĩnh và tận tâm hiếm có. Bateco thật tự hào vì có Chị cùng đi trên chặng đường này.',
    closing: 'Hôm nay, Chị cứ nghỉ ngơi, được chiều chuộng và làm “nữ chính” nhé!',
  },
  {
    intro: 'Nhân dịp 20/10, Bateco Group xin gửi đến Chị lời cảm ơn từ tận trái tim.',
    body: 'Cảm ơn Chị vì đã ở đây, đã cống hiến hết mình và luôn lan tỏa năng lượng tích cực, kể cả trong những ngày chẳng mấy dễ dàng. Có Chị, cả team như được tiếp thêm lửa.',
    closing: 'Chúc Chị luôn tươi tắn như những đóa hoa hôm nay Chị được nhận!',
  },
  {
    intro: 'Ngày Phụ nữ Việt Nam 20/10, chúc Chị vạn sự an lành, niềm vui trọn vẹn.',
    body: 'Bateco Group trân trọng từng dấu ấn Chị để lại. Nhờ có Chị, nhiều việc khó trở nên suôn sẻ, và cả team luôn vững tâm bước về phía trước, dù đường dài hay ngắn.',
    closing: 'Chúc Chị gặt hái thêm nhiều thành công và luôn được yêu thương.',
  },
  {
    intro: 'Bateco Group xin gửi lời chúc mừng thật ấm áp đến Chị nhân ngày 20/10.',
    body: 'Sự chỉn chu không phải ai cũng giữ được mỗi ngày, vậy mà Chị làm được, bền bỉ và lặng lẽ như một thói quen đẹp. Điều đó thật đáng ngưỡng mộ và đáng được ghi nhận.',
    closing: 'Chúc Chị một ngày 20/10 thật đáng nhớ bên những người Chị thương yêu.',
  },
  {
    intro: 'Nhân dịp 20/10, cả nhà Bateco xin gửi đến Chị muôn vàn yêu thương.',
    body: 'Mỗi khi cần, Chị luôn ở đó, sẵn lòng giúp đỡ mà chẳng đợi ai nhờ đến lần hai. Những điều ấy có khi chẳng ai nói thành lời, nhưng mọi người đều nhớ và thầm cảm ơn Chị.',
    closing: 'Chúc Chị hạnh phúc theo cách giản dị và chân thật nhất, như chính Chị.',
  },
  {
    intro: '20/10 đã về, Bateco Group xin gửi đến Chị một lời chúc thật ấm áp.',
    body: 'Không cần lời hoa mỹ, chỉ xin nói một điều thật lòng: có Chị trong đội ngũ, Bateco đẹp hơn, ấm hơn và vững vàng hơn rất nhiều. Cảm ơn Chị đã luôn đồng hành.',
    closing: 'Chúc Chị cười nhiều hơn, bớt âu lo và luôn có người chở che khi cần.',
  },
  {
    intro: 'Chúc Chị ngày Phụ nữ Việt Nam thật vui, thật ý nghĩa và thật nhiều yêu thương!',
    body: 'Sự tận tụy và tinh thần cầu tiến của Chị như một ngọn lửa nhỏ: đủ ấm để truyền cảm hứng, đủ sáng để cả tập thể Bateco cùng nhau tiến bước mỗi ngày.',
    closing: 'Chúc Chị luôn được đối xử dịu dàng, như cách Chị dịu dàng với cả thế giới.',
  },
  {
    intro: 'Nhân ngày 20/10, Bateco Group trân trọng gửi lời chúc mừng đến Chị.',
    body: 'Niềm tin là món quà quý giá nhất trong một tập thể, và Chị đã trao món quà ấy cho mọi người qua từng việc nhỏ mình làm mỗi ngày, bằng sự trách nhiệm và chân thành.',
    closing: 'Chúc Chị luôn khỏe mạnh, rạng ngời và mọi điều ước đều nở hoa!',
  },
  {
    intro: 'Chúc mừng 20/10! Bateco Group gửi đến Chị những lời chúc tốt đẹp nhất.',
    body: 'Dù là việc lớn hay việc nhỏ, Chị đều đặt vào đó trọn vẹn sự tận tâm. Hôm nay là dịp để cả nhà Bateco nói thật to điều vẫn luôn muốn nói: cảm ơn Chị rất nhiều!',
    closing: 'Chúc Chị một ngày ngập tràn hoa tươi, quà xinh và nụ cười rạng rỡ.',
  },
]

const PAGE_3_WISHES: Page3Wish[] = [
  {
    paragraph1:
      '20/10 không chỉ là ngày của hoa và quà. Đó là ngày để người phụ nữ nhớ rằng mình cũng xứng đáng được chăm sóc, như cách mình vẫn lặng lẽ chăm sóc mọi người.',
    paragraph2:
      'Hãy chậm lại một nhịp, cười nhiều hơn một chút và dành cho mình một khoảng trời riêng.',
    thanksLine: 'vì Chị đã luôn cố gắng theo cách rất riêng của mình.',
  },
  {
    paragraph1:
      'Hoa không cần rực rỡ nhất mới được yêu. Chị cũng vậy: không cần hoàn hảo, chỉ cần là chính mình đã đủ đặc biệt và đủ đáng trân trọng rồi.',
    paragraph2: 'Mong Chị luôn tự tin bước đi trên con đường mình chọn, với một trái tim nhẹ tênh.',
    thanksLine: 'vì Chị đã mang hơi ấm đến cho những người xung quanh.',
  },
  {
    paragraph1:
      'Phụ nữ đẹp nhất không phải lúc nào cũng mạnh mẽ, mà là khi dám mệt, dám nghỉ, rồi lại đứng lên với sự dịu dàng vẹn nguyên như thuở ban đầu.',
    paragraph2: 'Chúc Chị giữ mãi sự dịu dàng ấy, với mọi người và trước hết là với chính mình.',
    thanksLine: 'vì Chị đã làm mọi thứ dịu lại chỉ bằng sự hiện diện.',
  },
  {
    paragraph1:
      'Có những lời cảm ơn cất giữ mãi trong lòng, đến 20/10 mới có dịp nói ra. Không hoa mỹ, không dài dòng, chỉ thật lòng thôi.',
    paragraph2:
      'Cảm ơn Chị vì đã sống tử tế, bền bỉ nỗ lực và gieo những điều tốt đẹp theo cách của riêng mình.',
    thanksLine: 'vì Chị đã chọn sống đẹp mỗi ngày, dù chẳng ai nhắc.',
  },
  {
    paragraph1:
      'Có những ngày Chị phải gồng lên thật nhiều, cười cả khi lòng mỏi mệt. 20/10 này, hãy tạm đặt gánh nặng xuống, dù chỉ một buổi sáng thôi.',
    paragraph2: 'Chị xứng đáng được nghỉ ngơi, được lắng nghe và được yêu thương thật trọn vẹn.',
    thanksLine: 'vì Chị đã luôn nỗ lực hết mình một cách thật đẹp.',
  },
  {
    paragraph1:
      'Vẻ đẹp của người phụ nữ không nằm ở việc gánh vác được tất cả, mà ở chỗ biết mình là ai và vẫn đủ mềm mại để yêu thương.',
    paragraph2: 'Chúc Chị giữ được điều quý giá ấy, hôm nay và cả những ngày bình thường nhất.',
    thanksLine: 'vì Chị đã khiến thế giới quanh mình dịu dàng hơn.',
  },
  {
    paragraph1:
      '20/10, hãy mỉm cười với chính mình trước khi nhận lời chúc từ bất kỳ ai. Nụ cười thật đẹp ấy là món quà đầu tiên Chị dành cho bản thân.',
    paragraph2: 'Chị đã đi một chặng đường dài và đẹp. Hãy tự hào về điều đó, Chị nhé!',
    thanksLine: 'vì Chị đã luôn là phiên bản chân thật nhất của mình.',
  },
  {
    paragraph1:
      'Chị không cần đợi đến 20/10 mới được trân trọng. Chỉ là hôm nay, cả nhà Bateco muốn nói điều đó thành lời, thật rõ ràng và không ngại ngùng.',
    paragraph2: 'Chúc Chị luôn được lắng nghe, được thấu hiểu và nhận về những gì mình xứng đáng.',
    thanksLine: 'vì Chị đã thắp lên năng lượng tích cực cho cả tập thể.',
  },
  {
    paragraph1:
      'Ngày Phụ nữ Việt Nam là lời tri ân gửi đến sự dịu dàng, những hy sinh thầm lặng và cả những lúc Chị phải thật mạnh mẽ dù chẳng ai nhìn thấy.',
    paragraph2: 'Hãy nhớ yêu thương bản thân nhiều như cách Chị vẫn yêu thương mọi người mỗi ngày.',
    thanksLine: 'vì Chị đã sống tử tế và tận tâm theo cách riêng.',
  },
  {
    paragraph1:
      '20/10 này, chỉ mong Chị một điều giản dị: được vui theo cách mình muốn, được sống theo nhịp của riêng mình, như một đóa hoa nở đúng mùa.',
    paragraph2: 'Không cần gồng, không cần hoàn hảo, chỉ cần hạnh phúc là đủ.',
    thanksLine: 'vì Chị đã mang đến một sắc màu rất riêng cho Bateco.',
  },
  {
    paragraph1:
      'Đôi khi công việc cuốn ta đi nhanh đến mức quên rằng mình cũng cần được nâng niu. 20/10 là lời nhắc khẽ khàng cho điều ấy.',
    paragraph2: 'Chị quan trọng hơn Chị nghĩ, và xứng đáng được đối xử thật tốt mỗi ngày.',
    thanksLine: 'vì Chị đã luôn là một người đồng nghiệp tuyệt vời.',
  },
  {
    paragraph1:
      'Nhân 20/10, chúc Chị giữ mãi nụ cười thật đẹp, thứ khiến mọi người thấy nhẹ lòng mỗi khi gặp Chị, kể cả trong những ngày mệt mỏi nhất.',
    paragraph2:
      'Ngày thường hay ngày lễ, Chị đều đáng được cảm ơn. Hôm nay chỉ là dịp để cả nhà nói to hơn một chút.',
    thanksLine: 'vì Chị đã mang niềm vui đến cho những người quanh mình.',
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
  const item = items[index]
  if (item === undefined) {
    throw new Error('pickBySeed: empty list')
  }
  return item
}

/** Lời chúc trung tính — không nhắc tên tổ chức (thiệp gửi người ngoài). */
const EXTERNAL_PAGE_2_WISHES: Page2Wish[] = [
  {
    intro: 'Tháng Mười dịu dàng gõ cửa, xin gửi đến Chị lời chúc 20/10 thật ấm áp.',
    body: 'Giữa bộn bề công việc, Chị vẫn luôn giữ cho mọi thứ ngăn nắp, chu toàn và ấm áp. Sự chỉn chu ấy, nụ cười ấy thật đáng trân quý.',
    closing: 'Chúc Chị luôn rạng rỡ như nắng thu, bình yên như những sớm mai.',
  },
  {
    intro: 'Chúc mừng ngày Phụ nữ Việt Nam 20/10! Xin gửi đến Chị lời chúc chân thành nhất.',
    body: 'Có những người không cần nói nhiều, chỉ cần có mặt là mọi việc đã thấy vững vàng hơn. Chị chính là người như thế: lặng lẽ, tận tâm và luôn đáng tin cậy.',
    closing: 'Chúc Chị hôm nay hoa vây quanh, quà gõ cửa, yêu thương đong đầy.',
  },
  {
    intro: 'Nhân ngày 20/10, xin gửi tặng Chị một bó lời chúc thật xinh.',
    body: 'Cảm ơn Chị vì những ngày tận tâm, những lần sẵn lòng sẻ chia và cả những nụ cười tiếp sức giữa ngày bận rộn. Chị đã viết nên những trang rất đẹp trong câu chuyện của mình.',
    closing: 'Chúc Chị luôn xinh đẹp, khỏe mạnh, mỗi sớm mai đều có lý do để cười.',
  },
  {
    intro: 'Gửi Chị — một đóa hoa đẹp, nhân ngày Phụ nữ Việt Nam 20/10.',
    body: 'Sự chu đáo của Chị nằm trong những điều rất nhỏ: một lời nhắc kịp lúc, một việc làm trọn vẹn, một câu hỏi han giữa ngày mệt mỏi. Chính những điều nhỏ ấy làm nên khác biệt lớn.',
    closing: 'Chúc Chị được nâng niu dịu dàng, như cách Chị vẫn quan tâm mọi người.',
  },
  {
    intro: 'Trân trọng gửi đến Chị lời chúc mừng ngày Phụ nữ Việt Nam 20/10.',
    body: 'Một nơi tử tế không tự nhiên mà có. Nó được vun lên từ những con người như Chị: chân thành, trách nhiệm, và luôn nghĩ cho người khác trước khi nghĩ cho mình.',
    closing: 'Chúc Chị một ngày nhiều niềm vui, nhiều bất ngờ và thật ít deadline!',
  },
  {
    intro: 'Nhân ngày tôn vinh phụ nữ Việt Nam, xin gửi đến Chị lời tri ân sâu sắc.',
    body: 'Sự bền bỉ của Chị giống như dòng nước: lặng lẽ, không ồn ào, nhưng luôn nuôi dưỡng và nâng đỡ những người đi cùng. May mắn thay vì có Chị trên hành trình này.',
    closing: 'Chúc Chị lòng luôn an yên, công việc hanh thông, gia đình đầy tiếng cười.',
  },
  {
    intro: 'Chúc Chị một ngày 20/10 ngọt ngào như hương hoa sữa đầu mùa thu!',
    body: 'Có những lúc công việc dồn dập như mưa, vậy mà Chị vẫn giữ được sự điềm tĩnh và tận tâm hiếm có. Thật tự hào vì có Chị cùng đi trên chặng đường này.',
    closing: 'Hôm nay, Chị cứ nghỉ ngơi, được chiều chuộng và làm “nữ chính” nhé!',
  },
  {
    intro: 'Nhân dịp 20/10, xin gửi đến Chị lời cảm ơn từ tận trái tim.',
    body: 'Cảm ơn Chị vì đã ở đây, đã cống hiến hết mình và luôn lan tỏa năng lượng tích cực, kể cả trong những ngày chẳng mấy dễ dàng. Có Chị, mọi người như được tiếp thêm lửa.',
    closing: 'Chúc Chị luôn tươi tắn như những đóa hoa hôm nay Chị được nhận!',
  },
]

const hasBrand = (text: string) => /bateco/i.test(text)

const EXTERNAL_PAGE_3_WISHES = PAGE_3_WISHES.filter(
  (w) => !hasBrand(`${w.paragraph1} ${w.paragraph2} ${w.thanksLine}`),
)

/** Thiệp cho mẹ — xưng “Mẹ”, không branding. */
const MOTHER_PAGE_2_WISHES: Page2Wish[] = [
  {
    intro: 'Nhân ngày Phụ nữ Việt Nam 20/10, con xin gửi đến Mẹ lời chúc thật chân thành.',
    body: 'Cảm ơn Mẹ vì cả đời nâng niu, vì những bữa cơm nóng, những lời nhắc khẽ và vòng tay luôn rộng mở khi con mệt. Có Mẹ, con luôn biết mình được yêu.',
    closing: 'Chúc Mẹ luôn khỏe, luôn vui, và được chiều chuộng như cách Mẹ vẫn chiều con.',
  },
  {
    intro: '20/10 này, con muốn nói với Mẹ một điều giản dị: cảm ơn Mẹ rất nhiều.',
    body: 'Mẹ là người dạy con yêu thương, dạy con đứng dậy sau mỗi lần vấp ngã, và dạy con rằng nhà luôn là nơi bình yên nhất. Con mang ơn Mẹ mỗi ngày.',
    closing: 'Chúc Mẹ ngày 20/10 thật ấm áp, nhiều hoa và nhiều tiếng cười.',
  },
  {
    intro: 'Gửi Mẹ yêu — người phụ nữ đẹp nhất trong mắt con, nhân ngày 20/10.',
    body: 'Dù thời gian trôi, hình ảnh Mẹ vẫn luôn dịu dàng và vững vàng. Con lớn lên nhờ tình yêu ấy, và hôm nay chỉ muốn Mẹ được nghỉ ngơi, được yêu chiều thật nhiều.',
    closing: 'Chúc Mẹ mạnh khỏe, an yên, hạnh phúc theo cách giản dị nhất.',
  },
  {
    intro: 'Tháng Mười về, con lại nhớ Mẹ nhiều hơn — nhớ cả những điều nhỏ Mẹ làm mỗi ngày.',
    body: 'Những lo toan thầm lặng, những hy sinh không kể, và nụ cười vẫn dành cho con. 20/10 này, con xin gửi hết yêu thương về phía Mẹ.',
    closing: 'Chúc Mẹ được hạnh phúc, được chăm sóc và luôn có con bên cạnh.',
  },
]

const MOTHER_PAGE_3_WISHES: Page3Wish[] = [
  {
    paragraph1:
      'Mẹ không cần đợi đến 20/10 mới được trân trọng. Chỉ là hôm nay, con muốn nói điều đó thành lời, thật rõ ràng và không ngại ngùng.',
    paragraph2: 'Chúc Mẹ luôn được lắng nghe, được thấu hiểu và nhận về những gì Mẹ xứng đáng.',
    thanksLine: 'vì Mẹ đã cho con cả một bầu trời yêu thương.',
  },
  {
    paragraph1:
      '20/10 không chỉ là ngày của hoa và quà. Đó là ngày để Mẹ nhớ rằng mình cũng xứng đáng được chăm sóc, như cách Mẹ vẫn lặng lẽ chăm sóc mọi người.',
    paragraph2:
      'Hãy chậm lại một nhịp, cười nhiều hơn một chút và dành cho mình một khoảng trời riêng.',
    thanksLine: 'vì Mẹ đã luôn là chỗ dựa vững vàng nhất của con.',
  },
  {
    paragraph1:
      'Vẻ đẹp của Mẹ không nằm ở việc gánh vác được tất cả, mà ở chỗ biết yêu thương bằng cả trái tim, dù có lúc mệt nhoài.',
    paragraph2: 'Chúc Mẹ giữ được sự dịu dàng ấy, hôm nay và cả những ngày bình thường nhất.',
    thanksLine: 'vì Mẹ đã khiến ngôi nhà luôn ấm áp.',
  },
]

/** Thiệp cho người yêu — xưng “Em”, không branding. */
const PARTNER_PAGE_2_WISHES: Page2Wish[] = [
  {
    intro: 'Nhân ngày 20/10, anh chúc em luôn luôn xinh đẹp và hạnh phúccc.',
    body: 'Cảm ơn em vì đã xuất hiện trong đời anh, vì những ngày đi chơi cùm nhau và cả những lúc em chỉ cần ở bên là anh thấy đủ. Em là món quà đẹp nhất anh có.',
    closing: 'Chúc Em luôn xinh đẹp, hạnh phúc, và biết rằng anh luôn ở đây vì emmm.',
  },
]

const PARTNER_PAGE_3_WISHES: Page3Wish[] = [
  {
    paragraph1:
      'Anh không giỏi nói lời ngọt ngào, nhưng anh iuuu em nhiều lắm. Có em nhắn tin cho anh mỗi ngày của anh đều rấc vui.',
    paragraph2: 'Mong em luôn vui vẻ, xinh đẹp và có chuyện gì cũng nhớ kể anh nghe nhé.',
    thanksLine: 'Cảm ơn em đã đến bên anh. Mong năm nào anh cũng được chúc em 20/10 nhé.',
  },
]

export const pickPage2Wish = (seed: string, kind: WishKind = 'bateco'): Page2Wish => {
  const pool =
    kind === 'mother'
      ? MOTHER_PAGE_2_WISHES
      : kind === 'partner'
        ? PARTNER_PAGE_2_WISHES
        : kind === 'external'
          ? EXTERNAL_PAGE_2_WISHES
          : PAGE_2_WISHES
  return pickBySeed(pool, seed, 'page2')
}

export const pickPage3Wish = (seed: string, kind: WishKind = 'bateco'): Page3Wish => {
  const pool =
    kind === 'mother'
      ? MOTHER_PAGE_3_WISHES
      : kind === 'partner'
        ? PARTNER_PAGE_3_WISHES
        : kind === 'external'
          ? EXTERNAL_PAGE_3_WISHES
          : PAGE_3_WISHES
  return pickBySeed(pool, seed, 'page3')
}

// Self-check: thiệp cá nhân / ngoài không được lọt chữ Bateco.
if (process.env.NODE_ENV !== 'production') {
  for (const pool of [EXTERNAL_PAGE_2_WISHES, MOTHER_PAGE_2_WISHES, PARTNER_PAGE_2_WISHES]) {
    for (const w of pool) {
      if (hasBrand(`${w.intro} ${w.body} ${w.closing}`)) {
        throw new Error('Wish pool còn chữ Bateco')
      }
    }
  }
  if (EXTERNAL_PAGE_3_WISHES.length === 0) {
    throw new Error('EXTERNAL_PAGE_3_WISHES rỗng')
  }
}

/** Tách tên hiển thị 2 dòng kiểu thiệp: "Chị Trần Thị" / "Kim Trâm". */
export const splitDisplayName = (
  honorific: string | undefined,
  name: string,
): { line1: string; line2: string } => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) {
    return { line1: honorific?.trim() || 'Chị', line2: 'Yêu quý' }
  }
  const [first, second] = parts
  if (parts.length === 1 && first) {
    return {
      line1: honorific?.trim() || 'Chị',
      line2: first,
    }
  }
  if (parts.length === 2 && first && second) {
    return {
      line1: [honorific, first].filter(Boolean).join(' '),
      line2: second,
    }
  }
  return {
    line1: [honorific, ...parts.slice(0, -2)].filter(Boolean).join(' '),
    line2: parts.slice(-2).join(' '),
  }
}
