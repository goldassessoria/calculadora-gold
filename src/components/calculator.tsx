'use client';

import { useState, useMemo } from 'react';
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

const ownDeliveryRates = {
  commission: 0.12,
  payment: 0.035,
  anticipation: 0.0159,
};

const partnerDeliveryRates = {
  commission: 0.23,
  payment: 0.035,
  anticipation: 0.0159,
};

export default function Calculator() {
  const [netValue, setNetValue] = useState<number | ''>('');
  const [sellingPrice, setSellingPrice] = useState<number | null>(null);

  const ownDeliveryTotalTax = useMemo(() => {
    return (ownDeliveryRates.commission + ownDeliveryRates.payment + ownDeliveryRates.anticipation) * 100;
  }, []);

  const partnerDeliveryTotalTax = useMemo(() => {
    return (partnerDeliveryRates.commission + partnerDeliveryRates.payment + partnerDeliveryRates.anticipation) * 100;
  }, []);

  const calculatePrice = () => {
    const value = netValue === '' ? 0 : Number(netValue);
    if (value > 0) {
      // For simplicity, let's just calculate based on a single rate for now or decide which one to show.
      // Based on the image, there isn't a final price output, just the taxes.
      // Let's make the button calculate a hypothetical price for demonstration.
      const price = value / (1 - (partnerDeliveryRates.commission + partnerDeliveryRates.payment + partnerDeliveryRates.anticipation));
      setSellingPrice(price);
    } else {
      setSellingPrice(null);
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
                readOnly
                value={ownDeliveryTotalTax.toFixed(2)}
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
                readOnly
                value={partnerDeliveryTotalTax.toFixed(2)}
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

          {sellingPrice !== null && (
            <div className="mt-4 text-center text-white p-4 bg-black/50 rounded-lg">
                <p className="text-lg">Preço de Venda Sugerido (Entrega Parceira):</p>
                <p className="text-3xl font-bold text-primary">{formatCurrency(sellingPrice)}</p>
            </div>
          )}

        </div>
      </CardContent>
    </Card>
  );
}
