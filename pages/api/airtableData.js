import { getIndieRecordsFunction, 
        getCommunityRecordsFunction, 
        getProjectsWorkRecordsFunction, 
        getProjectTitleFunction,
        getBountiesRecordsFunction,
        getCabsRecordsFunction,
        getAllTitleFunction,
        getBrainTrustRecordsFunction,
      } from "../../lib/airtable";

const getIndieRecordsApi = async (req, res) => {

  try {
    const records = await getIndieRecordsFunction();

    if (records.length !== 0) {
      res.json(records);
    } else {
      res.json({ message: `id could not be found` });
    }

  } catch (error) {
    res.status(500);
    res.json({ message: "Something went wrong", error });
  }
};

const getCommunityRecordsApi = async (req, res) => {

  try {
    const records = await getCommunityRecordsFunction();

    if (records.length !== 0) {
      res.json(records);
    } else {
      res.json({ message: `id could not be found` });
    }

  } catch (error) {
    res.status(500);
    res.json({ message: "Something went wrong", error });
  }
};

const getProjectsRecordsApi = async (req, res) => {

  try {
    const records = await getProjectsWorkRecordsFunction();

    if (records.length !== 0) {
      res.json(records);
    } else {
      res.json({ message: `id could not be found` });
    }

  } catch (error) {
    res.status(500);
    res.json({ message: "Something went wrong", error });
  }
};

const getProjectTitle = async (req, res) => {
  const { id } = req.query;

  try {
    const records = await getProjectTitleFunction(id);

    if (records.length !== 0) {
      res.json(records);
    } else {
      res.json({ message: `id could not be found` });
    }

  } catch (error) {
    res.status(500);
    res.json({ message: "Something went wrong", error });
  }
};

export default async function handler(req, res) {
  const { query } = req.query;

  switch (query) {
    case "indie":
      await getIndieRecordsApi(req, res);
      break;
    case "community":
      await getCommunityRecordsApi(req, res);
      break;
    case "projects":
      await getProjectsRecordsApi(req, res);
      break;
      
    case "bounties":
      await getBountiesRecordsFunction(req, res).then(data => {
        res.json(data);
      }).catch(error => {
        res.status(400);
        res.json({ message: "Something went wrong", error });
      });
      break;

    case "cabs":
      await getCabsRecordsFunction(req, res).then(data => {
        res.json(data);
      }).catch(error => {
        res.status(400);
        res.json({ message: "Something went wrong", error });
      })
      break;

    case "title":
      await getAllTitleFunction(req, res).then(data => {
        res.json(data);
      }).catch(error => {
        res.status(400);
        res.json({ message: "Something went wrong", error });
      });
      break;
    case "braintrust":
      await getBrainTrustRecordsFunction(req, res).then(data => {
        res.json(data);
      }).catch(error => {
        res.status(400);
        res.json({ message: "Something went wrong", error });
      });
      break;
    default:
      res.status(404).json({ message: "Not found" });
  }
}