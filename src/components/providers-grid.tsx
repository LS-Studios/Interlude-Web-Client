import Image from 'next/image';
import { getProviders } from '@/lib/actions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { translations } from '@/lib/i18n';

export async function ProvidersGrid() {
  const providers = await getProviders();

  // This component will be rendered on the server, so we can't use hooks.
  // We'll default to English for the server-rendered title. A full i18n solution would handle this differently.
  const title = translations.en['home.supported_providers'];

  if (providers.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-12">
      <h2 className="text-2xl font-bold tracking-tight mb-6 text-center">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {providers.map(provider => (
          <Card key={provider.id} className="flex flex-col items-center justify-center p-4 text-center">
            <CardContent className="p-0 flex-grow flex items-center justify-center">
              <Image
                src={provider.logo}
                alt={`${provider.name} logo`}
                width={64}
                height={64}
                className="h-16 w-16 object-contain"
                unoptimized
              />
            </CardContent>
            <CardHeader className="p-0 pt-4">
              <CardTitle className="text-sm font-medium">{provider.name}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
