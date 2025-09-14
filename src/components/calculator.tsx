'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Utensils } from 'lucide-react';

const TAX_RATES_KEY = 'calculadoraGoldTaxRates';

interface PlanRates {
  commission: number;
  payment: number;
  anticipation: number;
}

interface TaxRates {
  basic: PlanRates;
  partner: PlanRates;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const calculatePlan = (netValue: number, rates: PlanRates) => {
    if (netValue <= 0) {
      return { sellingPrice: 0, totalFees: 0, finalValue: 0 };
    }
    const commissionRate = rates.commission / 100;
    const paymentRate = rates.payment / 100;
    const anticipationRate = rates.anticipation / 100;
    
    const totalRate = commissionRate + paymentRate + anticipationRate;

    if (totalRate >= 1) {
      return { sellingPrice: Infinity, totalFees: Infinity, finalValue: 0 };
    }

    const price = netValue / (1 - totalRate);
    const fees = price * totalRate;
    const final = price - fees;

    return { sellingPrice: price, totalFees: fees, finalValue: final };
};


export default function Calculator() {
  const [netValue, setNetValue] = useState<number | ''>('');
  const [taxRates, setTaxRates] = useState<TaxRates>({
    basic: { commission: 12, payment: 3.5, anticipation: 1.99 },
    partner: { commission: 23, payment: 3.5, anticipation: 1.99 },
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const savedRates = localStorage.getItem(TAX_RATES_KEY);
      if (savedRates) {
        const parsedRates = JSON.parse(savedRates);
        if (parsedRates.basic && parsedRates.partner) {
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

  const handleTaxRateChange = (plan: 'basic' | 'partner', key: keyof PlanRates, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setTaxRates((prev) => ({ 
      ...prev, 
      [plan]: {
        ...prev[plan],
        [key]: numericValue,
      }
    }));
  };

  const basicPlanResult = useMemo(() => {
    const value = netValue === '' ? 0 : Number(netValue);
    return calculatePlan(value, taxRates.basic);
  }, [netValue, taxRates.basic]);

  const partnerPlanResult = useMemo(() => {
    const value = netValue === '' ? 0 : Number(netValue);
    return calculatePlan(value, taxRates.partner);
  }, [netValue, taxRates.partner]);

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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               <div>
                <h3 className="text-lg font-medium">Plano Básico</h3>
                 <div className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="basic-commission">Comissão iFood (%)</Label>
                      <Input
                        id="basic-commission"
                        type="number"
                        value={isClient ? taxRates.basic.commission : ''}
                        onChange={(e) => handleTaxRateChange('basic', 'commission', e.target.value)}
                        className="mt-1"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                     <div>
                      <Label htmlFor="basic-payment">Taxa de Pagamento (%)</Label>
                      <Input
                        id="basic-payment"
                        type="number"
                        value={isClient ? taxRates.basic.payment : ''}
                        onChange={(e) => handleTaxRateChange('basic', 'payment', e.target.value)}
                        className="mt-1"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                     <div>
                      <Label htmlFor="basic-anticipation">Taxa de Antecipação (%)</Label>
                      <Input
                        id="basic-anticipation"
                        type="number"
                        value={isClient ? taxRates.basic.anticipation : ''}
                        onChange={(e) => handleTaxRateChange('basic', 'anticipation', e.target.value)}
                        className="mt-1"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                 </div>
               </div>
               <div>
                <h3 className="text-lg font-medium">Entrega Parceiro</h3>
                 <div className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="partner-commission">Comissão iFood (%)</Label>
                      <Input
                        id="partner-commission"
                        type="number"
                        value={isClient ? taxRates.partner.commission : ''}
                        onChange={(e) => handleTaxRateChange('partner', 'commission', e.target.value)}
                        className="mt-1"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                     <div>
                      <Label htmlFor="partner-payment">Taxa de Pagamento (%)</Label>
                      <Input
                        id="partner-payment"
                        type="number"
                        value={isClient ? taxRates.partner.payment : ''}
                        onChange={(e) => handleTaxRateChange('partner', 'payment', e.target.value)}
                        className="mt-1"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                     <div>
                      <Label htmlFor="partner-anticipation">Taxa de Antecipação (%)</Label>
                      <Input
                        id="partner-anticipation"
                        type="number"
                        value={isClient ? taxRates.partner.anticipation : ''}
                        onChange={(e) => handleTaxRateChange('partner', 'anticipation', e.target.value)}
                        className="mt-1"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                 </div>
               </div>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="bg-card-foreground/5 rounded-lg p-6 flex flex-col justify-center">
            <h3 className="text-center font-bold text-xl mb-4">Preço de venda sugerido</h3>
            
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <h4 className="font-semibold text-lg">Plano Básico</h4>
                <p className="text-3xl font-bold text-primary tracking-tight">
                  {isFinite(basicPlanResult.sellingPrice) ? formatCurrency(basicPlanResult.sellingPrice) : 'Inválido'}
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-lg">Entrega Parceiro</h4>
                 <p className="text-3xl font-bold text-primary tracking-tight">
                  {isFinite(partnerPlanResult.sellingPrice) ? formatCurrency(partnerPlanResult.sellingPrice) : 'Inválido'}
                </p>
              </div>
            </div>
            
            <Separator className="my-4" />

            <div className="grid grid-cols-2 gap-4 text-center">
              {/* Basic Plan Breakdown */}
              <div>
                 {[
                  { label: 'Taxas Totais', value: basicPlanResult.totalFees, negative: true },
                  { label: 'Valor Final', value: basicPlanResult.finalValue, isFinal: true },
                ].map((item) => (
                  <div key={`${item.label}-basic`} className={`py-2 ${item.isFinal ? 'font-bold' : ''} ${item.negative ? 'text-destructive' : ''}`}>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="text-lg">
                      {item.negative ? '- ' : ''}
                      {isFinite(item.value) ? formatCurrency(Math.abs(item.value)) : '-'}
                    </p>
                  </div>
                ))}
              </div>
              
              {/* Partner Plan Breakdown */}
              <div>
                {[
                  { label: 'Taxas Totais', value: partnerPlanResult.totalFees, negative: true },
                  { label: 'Valor Final', value: partnerPlanResult.finalValue, isFinal: true },
                ].map((item) => (
                  <div key={`${item.label}-partner`} className={`py-2 ${item.isFinal ? 'font-bold' : ''} ${item.negative ? 'text-destructive' : ''}`}>
                    <p className="text-sm text-muted-foreground">{item.label}</p>
                    <p className="text-lg">
                      {item.negative ? '- ' : ''}
                      {isFinite(item.value) ? formatCurrency(Math.abs(item.value)) : '-'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
