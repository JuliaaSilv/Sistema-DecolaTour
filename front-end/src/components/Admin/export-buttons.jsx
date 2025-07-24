import { FileText, Download, Calendar as CalendarIcon } from "lucide-react";
import Button from "./ui/Button";
import Card from "./ui/Card";
import CardContent from "./ui/CardContent";
import { cn } from "../../lib/utils";

export default function ExportButtons() {
  return (
    <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Exportar Relatórios</h3>
            <p className="text-sm text-gray-600">Baixe relatórios detalhados em diferentes formatos</p>
          </div>
          <div className="flex space-x-3">
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <FileText className="w-4 h-4 mr-2" />
              Excel
            </Button>
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <CalendarIcon className="w-4 h-4 mr-2" />
              Mensal
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}