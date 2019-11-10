import * as Yup from 'yup';

import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists.' });
    }

    const {
      id,
      name,
      email,
      age,
      weight,
      height,
      provider,
    } = await Student.create(req.body);

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
      provider,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
      name: Yup.string(),
      email: Yup.string().email(),
      age: Yup.number(),
      weight: Yup.number(),
      height: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.body;

    const student = await Student.findByPk(id);

    // Verifica se id informado existe
    if (!student) {
      return res.status(400).json({ error: 'Student does not exists.' });
    }

    // Verifica se o e-mail está sendo alterado
    // Caso esteja, verifica se o novo e-mail informado já existe no banco
    if (student.email !== req.body.email) {
      const studentExists = await Student.findOne({
        where: { email: req.body.email },
      });

      if (studentExists) {
        return res
          .status(400)
          .json({ error: 'Student email already registered.' });
      }
    }

    const { name, email, age, weight, height, provider } = await student.update(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
      provider,
    });
  }
}

export default new StudentController();
