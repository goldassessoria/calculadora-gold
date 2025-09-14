'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Utensils } from 'lucide-react';
import { GoldButton } from '@/components/ui/gold-button';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

interface CalculationResult {
  sellingPrice: number;
  totalFees: number;
}

export default function Calculator() {
  const [netValue, setNetValue] = useState<number | ''>('');
  const [results, setResults] = useState<{ own: CalculationResult, partner: CalculationResult } | null>(null);

  const [ownDeliveryTotalTax, setOwnDeliveryTotalTax] = useState(17.09);
  const [partnerDeliveryTotalTax, setPartnerDeliveryTotalTax] = useState(28.09);

  const calculatePrice = () => {
    const value = netValue === '' ? 0 : Number(netValue);
    if (value > 0) {
      const ownTotalRate = ownDeliveryTotalTax / 100;
      const ownSellingPrice = value / (1 - ownTotalRate);
      const ownResults: CalculationResult = {
        sellingPrice: ownSellingPrice,
        totalFees: ownSellingPrice * ownTotalRate,
      };

      const partnerTotalRate = partnerDeliveryTotalTax / 100;
      const partnerSellingPrice = value / (1 - partnerTotalRate);
      const partnerResults: CalculationResult = {
        sellingPrice: partnerSellingPrice,
        totalFees: partnerSellingPrice * partnerTotalRate,
      };
      
      setResults({ own: ownResults, partner: partnerResults });
    } else {
      setResults(null);
    }
  };

  return (
    <Card className="w-full max-w-lg shadow-2xl bg-[#1E1E1E] border border-primary/30 shadow-primary/20">
      <CardHeader className="text-center">
        <div className="flex justify-center items-center gap-3">
            <Utensils className="h-8 w-8 text-primary" />
            <CardTitle className="text-3xl font-bold text-white">
            Calculadora Gold
            </CardTitle>
        </div>
        <CardDescription className="text-gray-400">
          Pare de vender no prejuízo. Descubra o preço de venda ideal para seus produtos no iFood.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-8 pb-8">
        <div className="flex flex-col gap-6">
          <div className="space-y-2">
            <Label htmlFor="netValue" className="font-medium text-white">
              Valor que você quer receber (líquido)
            </Label>
            <Input
              id="netValue"
              type="number"
              value={netValue}
              onChange={(e) => setNetValue(e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
              className="bg-black border-gray-700 text-white placeholder:text-gray-500 h-12 text-base"
              placeholder="Ex: R$ 50,00"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="own-delivery" className="font-medium text-white">Entrega Própria (%)</Label>
              <Input
                id="own-delivery"
                type="number"
                value={ownDeliveryTotalTax}
                onChange={(e) => setOwnDeliveryTotalTax(parseFloat(e.target.value) || 0)}
                className="bg-black border-gray-700 text-white h-12 text-center font-bold text-base"
              />
              <p className="text-xs text-gray-400 text-center">
                Comissão (12%) + Taxa Pagamento (3,5%) + Taxa Antecipação (1,59%).
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="partner-delivery" className="font-medium text-white">Entrega Parceira (%)</Label>
              <Input
                id="partner-delivery"
                type="number"
                value={partnerDeliveryTotalTax}
                onChange={(e) => setPartnerDeliveryTotalTax(parseFloat(e.target.value) || 0)}
                className="bg-black border-gray-700 text-white h-12 text-center font-bold text-base"
              />
              <p className="text-xs text-gray-400 text-center">
                Comissão (23%) + Taxa Pagamento (3,5%) + Taxa Antecipação (1,59%).
              </p>
            </div>
          </div>
          
          <GoldButton onClick={calculatePrice} className="w-full h-12 text-base font-bold">
            Calcular Preço de Venda
          </GoldButton>

          {results && (
            <div className="mt-6 space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white">Preços Sugeridos para Venda</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/50 rounded-lg p-4 flex flex-col items-center">
                  <h4 className="text-lg font-bold text-primary mb-2">Plano Básico</h4>
                  <p className="text-sm text-gray-400 mb-4">(Entrega Própria)</p>
                  <p className="text-3xl font-bold text-white mb-4">{formatCurrency(results.own.sellingPrice)}</p>
                  <div className="text-xs text-gray-400 space-y-1 w-full text-left">
                    <p className="font-bold">Total de Taxas: <span className="float-right text-white">{formatCurrency(results.own.totalFees)}</span></p>
                  </div>
                </div>
                <div className="bg-black/50 rounded-lg p-4 flex flex-col items-center">
                  <h4 className="text-lg font-bold text-primary mb-2">Plano Entrega</h4>
                  <p className="text-sm text-gray-400 mb-4">(Entrega Parceira)</p>
                  <p className="text-3xl font-bold text-white mb-4">{formatCurrency(results.partner.sellingPrice)}</p>
                  <div className="text-xs text-gray-400 space-y-1 w-full text-left">
                    <p className="font-bold">Total de Taxas: <span className="float-right text-white">{formatCurrency(results.partner.totalFees)}</span></p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </CardContent>
    </Card>
  );
}
