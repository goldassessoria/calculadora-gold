'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Utensils } from 'lucide-react';

const TAX_RATES_KEY = 'calculadoraGoldTaxRates';

interface TaxRates {
  commission: number;
  payment: number;
  anticipation: number;
}

const taxRateLabels = {
  commission: 'Comissão iFood (%)',
  payment: 'Taxa de Pagamento (%)',
  anticipation: 'Taxa de Antecipação (%)',
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export default function Calculator() {
  const [netValue, setNetValue] = useState<number | ''>('');
  const [taxRates, setTaxRates] = useState<TaxRates>({
    commission: 12,
    payment: 3.5,
    anticipation: 1.99,
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const savedRates = localStorage.getItem(TAX_RATES_KEY);
      if (savedRates) {
        const parsedRates = JSON.parse(savedRates);
        // Basic validation to ensure keys exist
        if (parsedRates.commission && parsedRates.payment && parsedRates.anticipation) {
            setTaxRates(parsedRates);
        }
      }
    } catch (error) {
      console.error('Failed to load tax rates from local storage:', error);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        localStorage.setItem(TAX_RATES_KEY, JSON.stringify(taxRates));
      } catch (error) {
        console.error('Failed to save tax rates to local storage:', error);
      }
    }
  }, [taxRates, isClient]);

  const handleTaxRateChange = (key: keyof TaxRates, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setTaxRates((prev) => ({ ...prev, [key]: numericValue }));
  };

  const { sellingPrice, totalFees, finalValue } = useMemo(() => {
    if (netValue === '' || netValue <= 0) {
      return { sellingPrice: 0, totalFees: 0, finalValue: 0 };
    }
    const commissionRate = taxRates.commission / 100;
    const paymentRate = taxRates.payment / 100;
    const anticipationRate = taxRates.anticipation / 100;
    
    const totalRate = commissionRate + paymentRate + anticipationRate;

    if (totalRate >= 1) {
      return { sellingPrice: Infinity, totalFees: Infinity, finalValue: 0 };
    }

    const price = Number(netValue) / (1 - totalRate);
    const fees = price * totalRate;
    const final = price - fees;

    return { sellingPrice: price, totalFees: fees, finalValue: final };
  }, [netValue, taxRates]);

  return (
    <Card className="w-full max-w-4xl shadow-2xl font-headline">
      <CardHeader>
        <CardTitle className="flex items-center gap-3 text-3xl font-bold text-primary">
          <Utensils className="h-8 w-8" />
          Calculadora Gold
        </CardTitle>
        <CardDescription>Pare de vender no prejuízo. Descubra o preço de venda ideal para seus produtos no iFood.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Inputs & Settings */}
          <div className="flex flex-col gap-6">
            <div>
              <Label htmlFor="netValue" className="text-lg">Valor que você quer receber (líquido)</Label>
              <Input
                id="netValue"
                type="number"
                value={netValue}
                onChange={(e) => setNetValue(e.target.value === '' ? '' : parseFloat(e.target.value) || 0)}
                className="mt-2 text-2xl h-14 p-4"
                placeholder="Ex: R$ 50,00"
              />
            </div>

            <div>
              <h3 className="text-lg font-medium">Configurações de Taxas</h3>
              <div className="space-y-4 pt-4">
                {Object.entries(taxRateLabels).map(([key, label]) => (
                  <div key={key}>
                    <Label htmlFor={key}>{label}</Label>
                    <Input
                      id={key}
                      type="number"
                      value={isClient ? taxRates[key as keyof TaxRates] : ''}
                      onChange={(e) => handleTaxRateChange(key as keyof TaxRates, e.target.value)}
                      className="mt-1"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="bg-card-foreground/5 rounded-lg p-6 flex flex-col justify-center">
            <div className="text-center mb-6">
              <p className="text-muted-foreground text-lg">Preço de venda sugerido</p>
              <p className="text-5xl font-bold text-primary tracking-tight">
                {isFinite(sellingPrice) ? formatCurrency(sellingPrice) : 'Inválido'}
              </p>
            </div>
            
            <Separator className="my-4" />

            <h3 className="text-center font-bold text-xl mb-4">Comparativo de Planos</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <h4 className="font-semibold text-lg">Plano Básico</h4>
              </div>
              <div>
                <h4 className="font-semibold text-lg">Entrega Parceiro</h4>
              </div>

              {/* Assuming rates are same for now, but structure allows different values */}
              {[
                { label: 'Preço de Venda', value: sellingPrice },
                { label: 'Taxas Totais', value: totalFees, negative: true },
                { label: 'Valor Final', value: finalValue, isFinal: true },
              ].map((item, index) => (
                <>
                  <div key={`${item.label}-basic`} className={`py-2 ${item.isFinal ? 'font-bold text-primary' : ''} ${item.negative ? 'text-destructive' : ''}`}>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="text-lg">
                      {item.negative ? '- ' : ''}
                      {isFinite(item.value) ? formatCurrency(Math.abs(item.value)) : '-'}
                    </p>
                  </div>
                   <div key={`${item.label}-partner`} className={`py-2 ${item.isFinal ? 'font-bold text-primary' : ''} ${item.negative ? 'text-destructive' : ''}`}>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="text-lg">
                      {item.negative ? '- ' : ''}
                      {isFinite(item.value) ? formatCurrency(Math.abs(item.value)) : '-'}
                    </p>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
