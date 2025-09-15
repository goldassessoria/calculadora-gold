'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqData = [
  {
    question: 'Qual a porcentagem cobrada pelo iFood?',
    answer:
      'O iFood possui atualmente dois planos: Plano Básico: taxa de 12% (quando a entrega é feita pelo próprio estabelecimento). Plano Entrega: taxa de 23% (quando a entrega é realizada pela logística do iFood). Além disso, há uma taxa de 3,5% para pedidos pagos online e cobrança de mensalidade para estabelecimentos que faturam acima de R$ 1.800,00 por mês. Mais informações estão disponíveis no site oficial do iFood.',
  },
  {
    question: 'Como calcular o preço de venda no iFood?',
    answer:
      'Muitos lojistas optam por incluir a taxa do iFood no preço final do produto. Porém, precificação não deve se basear apenas nos custos, é importante analisar também: Seu posicionamento no mercado, comparação de preços com concorrentes diretos. Se apenas adicionar a taxa ao valor do produto, você pode acabar ficando fora do preço de mercado e perder competitividade.',
  },
  {
    question: 'Como considerar o custo dos cupons de desconto?',
    answer:
      'Se você participar de campanhas em que precisa custear o valor do cupom, não esqueça de acrescentar esse custo ao cálculo do seu produto. Exemplo: calcule normalmente o preço de venda e depois some o valor do cupom para não sair no prejuízo.',
  },
  {
    question: 'Onde posso consultar a taxa que estou pagando atualmente?',
    answer:
      'Dentro do Portal do Parceiro do iFood. Na tela inicial, role até o final e clique em “Alterar conta”. Lá você terá acesso às informações contratuais, como: Porcentagem de Comissão, plano de repasse, modelo de negócio, entre outras informações.',
  },
];

export default function Faq() {
  return (
    <div className="w-full max-w-lg px-2 sm:px-0">
      <h2 className="text-2xl font-bold text-center text-primary mb-6">
        Dúvidas Frequentes
      </h2>
      <Accordion type="single" collapsible className="w-full">
        {faqData.map((item, index) => (
          <AccordionItem value={`item-${index}`} key={index}>
            <AccordionTrigger className="text-left font-semibold text-white hover:no-underline">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-400">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
