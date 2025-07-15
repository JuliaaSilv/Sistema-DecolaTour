import logo from "../assets/logo.png";
export default function Login() {
  return (
    <section>
      <div className="bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-[#6A4C93] shadow-lg py-15 px-3 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" action="#" method="POST">
              <div>
                <div className="flex items-center justify-center">
                 <img src={logo} alt="logo" />
                </div>
                <label htmlFor="email" className="block text-sm font-medium text-white-700">
                  </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-white text-white-900 focus:outline-none focus:border-orange-500 placeholder-white text-white focus:outline-none focus:ring-orange-200 focus:border-3 sm:text-sm"
                    placeholder="Email"
                  />
                </div>
              </div>

              <div>
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
                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center">
                        <input id="lembre_me" name="lembre_me" type="checkbox"
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"/>
                        <label for="lembre_me" class="ml-2 block text-sm text-white">
                            Manter conectado
                        </label>
                    </div>

                    <div className="text-sm">
                        <a href="#" className="font-medium text-white underline">
                            Esqueceu a sua senha?
                        </a>
                    </div>
                </div>
                 </div>

              <div>
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#F28C38] hover:bg-[#F28C38] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Entrar
                </button>
              </div>
               <p className="mt-2 text-center text-sm text-gray-600 max-w">
            <a href="#" className="font-medium text-white hover:underline">
              Não tem uma conta? <strong className="hover:text-orange-500">Crie agora!</strong>
            </a>
          </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
