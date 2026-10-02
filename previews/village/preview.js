const topics = [
  {id:'home', label:'Genel bakış', icon:'house', title:'Genel bakış', text:'Gündüz şüphelileri tartış, gece rolünün yeteneğini kullan. Köylüler kurtları bulmaya, kurtlar köyü ele geçirmeye çalışır.'},
  {id:'play', label:'Oynanış', icon:'moon', title:'Oynanış', text:'Oyun gece ve gündüz turlarıyla ilerler. Gündüz tartışma ve oylama yapılır; gece roller kendi eylemlerini gerçekleştirir.'},
  {id:'roles', label:'Roller', icon:'users', title:'Roller', text:'11 köylü, 4 kurt ve 2 bağımsız rol. Rolünü ve kazanma koşulunu oyun başlamadan önce incele.'},
  {id:'win', label:'Kazanma', icon:'trophy', title:'Kazanma koşulları', text:'Köylüler, kurtlar ve bağımsız rollerin kazanma koşulları farklıdır. Takımının hedefini rol rehberinden kontrol et.'},
  {id:'lobby', label:'Lobi ve komutlar', icon:'compass', title:'Lobi ve komutlar', text:'Oyuna katılma, harita oylaması ve yeniden bağlanma bilgileri.'},
  {id:'faq', label:'Sorular', icon:'circle-question', title:'Sık sorulanlar', text:'Oyun akışı, roller ve lobi hakkında sık sorulan sorular.'}
];
const params = new URLSearchParams(location.search);
const design = Math.min(5, Math.max(1, Number(params.get('design')) || 1));
const topic = topics.find(item => item.id === params.get('topic')) || topics[0];
document.body.dataset.design = design;
document.title = "Rob's Village · Tasarım " + design;
document.querySelectorAll('.design-picker a').forEach((link, index) => {
  link.href = '?design=' + (index + 1) + '&topic=' + topic.id;
  if(index + 1 === design) link.setAttribute('aria-current', 'page');
});
function topicLink(item) {
  const link = document.createElement('a');
  link.href = '?design=' + design + '&topic=' + item.id;
  const icon = document.createElement('i');
  icon.className = 'fa-solid fa-' + item.icon;
  icon.setAttribute('aria-hidden', 'true');
  const label = document.createElement('span');
  label.textContent = item.label;
  link.append(icon, label);
  if(item === topic) link.setAttribute('aria-current', 'page');
  return link;
}
const navigation = document.querySelector('#village-navigation');
if(design === 5) {
  const current = document.createElement('strong');
  current.textContent = topic.label;
  const details = document.createElement('details');
  const summary = document.createElement('summary');
  summary.innerHTML = '<i class="fa-solid fa-table-cells-large" aria-hidden="true"></i> Bölümler <i class="fa-solid fa-chevron-down" aria-hidden="true"></i>';
  const list = document.createElement('div');
  topics.forEach(item => list.append(topicLink(item)));
  details.append(summary, list);
  navigation.append(current, details);
  document.addEventListener('keydown', event => { if(event.key === 'Escape') details.open = false; });
} else topics.forEach(item => navigation.append(topicLink(item)));
const content = document.querySelector('#topic-content');
const heading = document.createElement('h2');
heading.id = 'topic-title';
heading.textContent = topic.title;
const paragraph = document.createElement('p');
paragraph.textContent = topic.text;
const figure = document.createElement('figure');
const image = document.createElement('img');
image.src = '../../assets/robs-village-gameplay.webp';
image.alt = "Rob's Village haritasında köy sokağı";
image.width = 1536;
image.height = 960;
figure.append(image);
content.append(heading, paragraph, figure);
document.querySelector('#theme-toggle').addEventListener('click', event => {
  const dark = document.documentElement.dataset.theme === 'dark';
  document.documentElement.dataset.theme = dark ? 'light' : 'dark';
  event.currentTarget.setAttribute('aria-label', dark ? 'Koyu temaya geç' : 'Açık temaya geç');
  event.currentTarget.querySelector('i').className = 'fa-solid fa-' + (dark ? 'moon' : 'sun');
});
