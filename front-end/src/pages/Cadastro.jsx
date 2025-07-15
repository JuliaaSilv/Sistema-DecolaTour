import logo from "../assets/logo.png";
export default function Cadastro(){
    return(
<section>
    <div className="bg-gray-100 flex flex-col justify-center py-5 sm:px-6 lg:px-8">
        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-[#6A4C93] shadow-lg py-15 px-3 shadow sm:rounded-lg sm:px-10">
            <div className="flex items-center justify-center">
                <img src={logo} alt="logo" />
            </div>
            <h2 className="text-white text-lg">Faça seu cadastro</h2>
            <form class="space-y-6" action="#" method="POST">
                <label htmlFor="nome" className="block text-sm font-medium text-white-700"></label>
                <div className="mt-1">
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    autoComplete="nome"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-white text-white-900 focus:outline-none focus:border-orange-500 placeholder-white text-white focus:outline-none focus:ring-orange-200 focus:border-3 sm:text-sm"
                    placeholder="Nome Completo"
                  />
                </div>
                 <label htmlFor="email" className="block text-sm font-medium text-white-700">
                  </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-white text-white-900 focus:outline-none focus:border-orange-500 placeholder-white text-white focus:outline-none focus:ring-orange-200 focus:border-3 sm:text-sm"
                    placeholder="Email"
                  />
                </div>
                 <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                </label>
                <div className="mt-1">
                  <input type="password"
                    id="senha"
                    name = "senha"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300  focus:border-orange-500 placeholder-white text-white focus:outline-none focus:ringorange-200 focus:border-3 sm:text-sm"
                    placeholder="Senha"
                  />
                  </div>
                   <label htmlFor="confirmarSenha" className="block text-sm font-medium text-gray-700">
                </label>
                <div className="mt-1">
                  <input type="password"
                    id="confirmarSenha"
                    name = "confirmarSenha"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300  focus:border-orange-500 placeholder-white text-white focus:outline-none focus:ringorange-200 focus:border-3 sm:text-sm"
                    placeholder="Repita sua senha"
                  />
                  </div>
                  <button
                  type="submit"
                  className="group relative w-full flex justify-center bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange 600 transition">Cadastrar</button>
            </form>
          </div>
        </div>
    </div>
</section>
    );
}