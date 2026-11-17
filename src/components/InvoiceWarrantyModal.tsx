import React from 'react';
import { X, Printer, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Sale } from '../types';
import { formatMoney } from '../i18n';

interface Props {
  sale: Sale | null;
  onClose: () => void;
  storeName: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
}

export const InvoiceWarrantyModal: React.FC<Props> = ({
  sale,
  onClose,
  storeName,
  storePhone,
  storeAddress,
  currency,
}) => {
  if (!sale) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">
              Facture & Certificat de Garantie — {sale.invoice_number}
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold cursor-pointer"
            >
              <Printer className="w-4 h-4" /> Imprimer Facture & Garantie
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 bg-slate-950">
          <div
            id="printable-area"
            className="bg-white text-slate-900 rounded-xl p-8 shadow-lg space-y-6"
          >
            {/* Header */}
            <div className="flex justify-between items-start border-b-2 border-slate-200 pb-5">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900">{storeName}</h1>
                <p className="text-xs text-slate-600 mt-1">{storeAddress}</p>
                <p className="text-xs text-slate-600">Tél: {storePhone}</p>
              </div>
              <div className="text-right">
                <div className="inline-block px-3 py-1 rounded bg-slate-900 text-white font-bold text-xs uppercase">
                  Facture & Bon de Garantie
                </div>
                <p className="text-sm font-mono font-bold mt-2">{sale.invoice_number}</p>
                <p className="text-xs text-slate-500">Date: {sale.created_at.slice(0, 16)}</p>
              </div>
            </div>

            {/* Client Info */}
            <div className="flex justify-between items-center bg-slate-100 p-4 rounded-lg text-xs">
              <div>
                <span className="text-slate-500 uppercase font-semibold">Client :</span>
                <p className="text-sm font-bold text-slate-900 mt-0.5">{sale.customer_name}</p>
              </div>
              <div className="text-right">
                <span className="text-slate-500 uppercase font-semibold">Tarification / Mode :</span>
                <p className="font-bold text-slate-800 mt-0.5 uppercase">
                  {sale.price_tier === 'wholesale' ? 'Vente en Gros' : 'Vente au Détail'} •{' '}
                  {sale.payment_method}
                </p>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-600 uppercase">
                  <th className="py-2.5">Désignation & N° Série</th>
                  <th className="py-2.5 text-center">Garantie</th>
                  <th className="py-2.5 text-center">Qté</th>
                  <th className="py-2.5 text-right">P.U</th>
                  <th className="py-2.5 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(sale.items || []).map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3">
                      <div className="font-bold text-slate-900">{item.product_name}</div>
                      <div className="text-[11px] font-mono text-slate-500">
                        Code: {item.barcode}
                        {item.serial_number ? ` | N° Série (S/N): ${item.serial_number}` : ''}
                      </div>
                    </td>
                    <td className="py-3 text-center">
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                        {item.warranty_months} Mois
                      </span>
                      {item.warranty_expires_at && (
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Jusqu’au {item.warranty_expires_at}
                        </div>
                      )}
                    </td>
                    <td className="py-3 text-center font-bold">{item.quantity}</td>
                    <td className="py-3 text-right">{formatMoney(item.unit_price, currency)}</td>
                    <td className="py-3 text-right font-bold">
                      {formatMoney(item.subtotal, currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end pt-4 border-t-2 border-slate-200">
              <div className="w-72 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Sous-Total :</span>
                  <span>{formatMoney(sale.subtotal, currency)}</span>
                </div>
                {sale.discount > 0 && (
                  <div className="flex justify-between text-red-600">
                    <span>Remise accordée :</span>
                    <span>-{formatMoney(sale.discount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-slate-900 pt-1 border-t border-slate-300">
                  <span>Total Net à Payer :</span>
                  <span>{formatMoney(sale.total_amount, currency)}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Montant Versé :</span>
                  <span>{formatMoney(sale.paid_amount, currency)}</span>
                </div>
                {sale.remaining_debt > 0 && (
                  <div className="flex justify-between text-amber-700 font-bold">
                    <span>Reste à Payer (Crédit / Facilité) :</span>
                    <span>{formatMoney(sale.remaining_debt, currency)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Warranty Certificate Box */}
            <div className="p-4 rounded-lg border border-slate-300 bg-slate-50 text-[11px] text-slate-600 space-y-1">
              <div className="font-bold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Conditions de Garantie Officielle Magasin :
              </div>
              <p>
                La garantie couvre les défauts de fabrication pendant la durée indiquée pour chaque appareil à compter de la date d’achat, sur présentation de cette facture avec le numéro de série intact. Ne sont pas couverts : les chocs électriques, casses d’écran, ou mauvaises utilisations.
              </p>
              <div className="flex justify-between pt-6 text-slate-800 font-semibold">
                <span>Cachet & Signature du Magasin</span>
                <span>Signature du Client</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
