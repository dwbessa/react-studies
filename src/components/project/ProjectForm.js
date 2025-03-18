import { useEffect, useState } from "react"

import Input from "../form/Input"
import Select from "../form/Select"
import SubmitButton from "../form/SubmitButton"

import styles from "./ProjectForm.module.css"

function ProjectForm ({ handleSubmit, btnText, projectData }) {

  const [categories, setCategories] = useState([])
  const [project, setProject] = useState(projectData || [])

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/categories`, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      },
      credentials: 'same-origin'
    })
      .then((resp) => {
        if (!resp.ok) {
          throw new Error('Failed to fetch categories');
        }
        return resp.json();
      })
      .then((data) => {
        setCategories(data)
      })
      .catch((err) => {
        console.error("Error fetching categories:", err)
      })
  }, [])

  const submit = (e) => {
    e.preventDefault()
    handleSubmit(project)
  }

  function handleChange(e) {
    // Sanitize inputs to prevent XSS
    const value = e.target.name === 'name' ? 
                  e.target.value.replace(/<[^>]*>?/gm, '') : 
                  e.target.value;
                  
    setProject({ ...project, [e.target.name]: value })
  }

  function handleCategory(e) {
    setProject({ 
      ...project, 
      category: {
        id: e.target.value,
        name: e.target.options[e.target.selectedIndex].text,
      },
    })
  }

  return (
    <form onSubmit={submit} className={styles.form}>
      <Input 
        type="text"
        text="Nome do Projeto"
        name="name"
        placeholder="Insira o nome do projeto"
        handleOnChange={handleChange}
        value={project.name ? project.name : ''} 
      />
      <Input 
        type="number"
        text="Insira o Orçamento do Projeto"
        name="budget"
        placeholder="Insira o orçamento total"
        handleOnChange={handleChange}
        value={project.budget ? project.budget : ''}
      />
      <Select 
        name="category_id" 
        text="Selecione a Categoria"
        options={categories}
        handleOnChange={handleCategory}
        value={project.category ? project.category.id : ''} 
      />
      <SubmitButton text={btnText}/>
  </form>
  )
}

export default ProjectForm