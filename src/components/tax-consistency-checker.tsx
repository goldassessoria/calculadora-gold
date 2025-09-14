'use client';

import type { TaxRateConsistencyOutput } from '@/ai/flows/tax-rate-consistency';
import { runCheckTaxRateConsistency } from '@/app/actions';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Cog, BotMessageSquare, AlertCircle, Wrench } from 'lucide-react';
import { useState } from 'react';

interface TaxConsistencyCheckerProps {
  taxRateLabels: string[];
}

export default function TaxConsistencyChecker({ taxRateLabels }: TaxConsistencyCheckerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<TaxRateConsistencyOutput | null>(null);
  const { toast } = useToast();

  const handleCheck = async () => {
    setIsLoading(true);
    setResult(null);
    try {
      const localStorageKeys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          localStorageKeys.push(key);
        }
      }

      const response = await runCheckTaxRateConsistency({
        taxRateLabels,
        localStorageKeys,
      });
      setResult(response);
    } catch (error) {
      console.error('Consistency check failed:', error);
      toast({
        variant: 'destructive',
        title: 'Erro na Verificação',
        description: 'Não foi possível concluir a verificação de consistência. Tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getDiscrepancyTypeInfo = (type: string) => {
    switch (type) {
      case 'label_only':
        return { title: 'Rótulo sem Chave', description: 'Uma taxa está definida na aplicação, mas não foi encontrada no armazenamento local.' };
      case 'key_only':
        return { title: 'Chave sem Rótulo', description: 'Uma chave foi encontrada no armazenamento local, mas não corresponde a nenhuma taxa na aplicação.' };
      case 'mismatch':
        return { title: 'Possível Incompatibilidade', description: 'Um rótulo e uma chave parecem relacionados, mas seus nomes não correspondem exatamente.' };
      default:
        return { title: 'Discrepância', description: 'Foi encontrada uma inconsistência.' };
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Cog className="h-5 w-5" />
          <span className="sr-only">Verificar Consistência de Taxas</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <BotMessageSquare className="h-6 w-6 text-primary" />
            Verificador de Consistência de Taxas
          </DialogTitle>
          <DialogDescription>
            Use a IA para verificar discrepâncias entre as taxas configuradas na aplicação e as chaves salvas no seu navegador.
          </DialogDescription>
        </DialogHeader>
        <div className="my-4">
          <Button onClick={handleCheck} disabled={isLoading} className="w-full">
            {isLoading ? 'Verificando...' : 'Verificar Agora'}
          </Button>
        </div>

        <ScrollArea className="h-96 pr-4">
          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          )}
          {result && (
             <>
                <Alert className="mb-4 bg-primary/10 border-primary/50">
                    <BotMessageSquare className="h-4 w-4" />
                    <AlertTitle>Resumo da IA</AlertTitle>
                    <AlertDescription>{result.summary}</AlertDescription>
                </Alert>
                
                {result.discrepancies.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">Nenhuma discrepância encontrada. Tudo parece consistente!</p>
                ) : (
                    <div className="space-y-4">
                        {result.discrepancies.map((d, index) => {
                            const typeInfo = getDiscrepancyTypeInfo(d.type);
                            return (
                                <Alert key={index} variant="destructive" className="bg-card">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertTitle>{typeInfo.title}</AlertTitle>
                                    <AlertDescription>
                                        <p className="font-semibold">{typeInfo.description}</p>
                                        <div className="mt-2 text-xs space-y-1 text-muted-foreground">
                                            {d.label && <p><strong>Rótulo:</strong> {d.label}</p>}
                                            {d.localStorageKey && <p><strong>Chave Local:</strong> {d.localStorageKey}</p>}
                                        </div>
                                        <div className="mt-3 flex items-start gap-2 p-2 bg-secondary rounded-md">
                                            <Wrench className="h-4 w-4 mt-0.5 text-primary shrink-0"/>
                                            <p className="text-sm"><strong>Sugestão:</strong> {d.resolutionSuggestion}</p>
                                        </div>
                                    </AlertDescription>
                                </Alert>
                            );
                        })}
                    </div>
                )}
            </>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
