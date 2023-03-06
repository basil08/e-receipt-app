export default function Layout(props) {
  return (
    <div class="container">
    <div class="row justify-content-center align-items-center g-2">
      <div class="col-8">
        <div class="row justify-content-center">
          <div class="col-8">
            {props.children}
          </div>
        </div>
      </div>
    </div>
  </div>

  )
}