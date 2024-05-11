/**
 * Global definitions to be included into files as needed
 */

function getServerUrl() 
{
  return `http://localhost:8000`;
}

/**
 * @returns the date as string in shortened ISO format
 */
function toISOString( date)
{
  return date.toISOString().substring(0, 19);
}

/**
 * @returns the current date in shortened ISO format
 */
function now() 
{
  return toISOString( new Date());
}

module.exports= { now, toISOString, getServerUrl };
